import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { db } from "@/services/fireBaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


import axios from "axios"
import { Input } from "@/components/ui/input"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { googleSignIn } from "@/services/fireBaseConfig";

 

import { Button } from "@/components/ui/button"


import CustomCard from "@/components/Custom/Card"
import { FcMoneyTransfer } from "react-icons/fc";
import { GiPayMoney } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { BsAirplaneEnginesFill } from "react-icons/bs";
import { FaChampagneGlasses } from "react-icons/fa6";
import { MdFamilyRestroom } from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"




 
function CreateTrip() {
 
    const [open, setOpen] = React.useState(false)
    const [loading,setLoading]=React.useState(false)
    const [count, setCount] = React.useState(0);
   

    let prompt = `You are a travel expert. Generate a detailed travel plan in valid JSON format for the following:
    Location: {{destination}}
    Duration: {{no_of_days}} days
    Travelers: {{number_of_travelers}}
    Budget: {{budget}}

    IMPORTANT: 
    1. Use ONLY real, well-known hotels and attractions that actually exist in {{destination}}
    2. For each hotel and place, provide specific details that can be verified
    3. Include only popular, highly-rated hotels and attractions
    4. Ensure all prices are realistic for the location
    5. MUST recommend 4-5 different hotels that match the budget and group size
    6. Hotels should have different price points within the budget range
    7. RESPOND ONLY WITH THE JSON, no explanations

    Return in this exact format:
    {
      "destination": {
        "name": "string",
        "country": "string",
        "best_time_to_visit": "string",
        "currency": "string"
      },
      "hotels": [
        {
          "name": "string (use real hotel names)",
          "address": "string (full address)",
          "price_per_night": "number",
          "rating": "number (1-5)",
          "description": "string",
          "amenities": ["string"],
          "location": {
            "latitude": "number",
            "longitude": "number"
          }
        }
      ],
      "daily_itinerary": [
        {
          "day": "number",
          "places": [
            {
              "name": "string (use real place names)",
              "type": "string (museum/park/restaurant/etc)",
              "description": "string",
              "recommended_duration": "string",
              "ticket_price": "number",
              "best_time": "string",
              "location": {
                "address": "string",
                "latitude": "number",
                "longitude": "number"
              }
            }
          ],
          "transportation": {
            "method": "string",
            "estimated_cost": "number"
          }
        }
      ],
      "estimated_total_cost": {
        "accommodation": "number",
        "activities": "number",
        "transportation": "number",
        "food": "number",
        "total": "number",
        "currency": "string"
      }
    }`
    
    const [data,setData]=React.useState({})

    const [placesLoaded, setPlacesLoaded] = React.useState(false);
    const navigate=useNavigate()

    // Load Google Places API
    // React.useEffect(() => {
    //   if (!window.google && Object.keys(data).length > 0) {
    //     try{
    //       const script = document.createElement('script');
    //       script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places`;
    //       script.async = true;
    //       script.onload = () => setPlacesLoaded(true);
    //       document.head.appendChild(script);

    //     }
    //     catch(error){
    //       console.error("Error loading Google Places API:", error);
    //     }
    //   } else {
    //     setPlacesLoaded(true);
    //   }
    // }, [data]);

    const addData=async(tripData)=>{
      try {
        const user=JSON.parse(localStorage.getItem("user"));
        
        const docRef = await addDoc(collection(db, "trips"), {
          tripData:tripData,
          email:user.email,
          name:user.name,
          profilePic:user?.picture,
          userChoice:data
        });
        console.log("Document written with ID: ", docRef.id);
        navigate(`/view-trip/${docRef.id}`)
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }

    const getPlacePhoto = async (searchQuery, destination) => {
      if (!searchQuery) return null;

      try {
        // Use our proxy server to search for places
        const params = new URLSearchParams({
          query: searchQuery,
          ...(destination && {
            location: `${destination.latitude},${destination.longitude}`,
            radius: '10000'
          })
        });

        const searchResponse = await axios.get(`${import.meta.env.VITE_API_KRY}/api/places/textsearch?${params}`);
        
        if (searchResponse.data?.results?.[0]?.photos?.[0]?.photo_reference) {
          const photoRef = searchResponse.data.results[0].photos[0].photo_reference;
          const photoUrl = `${import.meta.env.VITE_API_KRY}/api/places/photo?maxwidth=800&photo_reference=${photoRef}`;
          return photoUrl;
        }
        return null;
      } catch (error) {
        console.error('Error fetching place photo:', error);
        return null;
      }
    };

    const enrichItineraryWithImages = async (itineraryData) => {
      try {
        const enrichedData = { ...itineraryData };

        enrichedData.destination['image_url'] = await getPlacePhoto(`${enrichedData.destination.name}`, undefined);
        
        // Add images for hotels
        for (let hotel of enrichedData.hotels || []) {
          const photoUrl = await getPlacePhoto(`${hotel.name}`, hotel.location);
          if (photoUrl) {
            hotel.image_url = photoUrl;
          }
        }
        
        // Add images for places in daily itinerary
        for (let day of enrichedData.daily_itinerary || []) {
          for (let place of day.places || []) {
            const photoUrl = await getPlacePhoto(`${place.name} ${place.location.address}`, {longitude: place.location.longitude, latitude: place.location.latitude});
            if (photoUrl) {
              place.image_url = photoUrl;
            }
          }
        }

        return enrichedData;
      } catch (error) {
        console.error('Error enriching itinerary with images:', error);
        return itineraryData;
      }
    };

    const generateItenary = async () => {
      try {
        setLoading(true)
        toast.loading("please wait it could take a while...")
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let finalPrompt = prompt
          .replace(/{{destination}}/g, data?.destination?.value || data?.destination || "")
          .replace(/{{budget}}/g, `${data?.budget || ""} USD`)
          .replace(/{{number_of_travelers}}/g, data?.travellers || "")
          .replace(/{{no_of_days}}/g, data?.days || "");

        console.log("Sending prompt:", finalPrompt);
        const response = await model.generateContent(finalPrompt);
        const result = response.response.text();
        setPlacesLoaded(true)
        
        console.log("Raw response from Gemini:", result);

        try {
          
          let jsonStr = result;
          const startIdx = result.indexOf('{');
          const endIdx = result.lastIndexOf('}') + 1;
          
          if (startIdx !== -1 && endIdx !== -1) {
            jsonStr = result.slice(startIdx, endIdx);
          }

          const parsedResult = JSON.parse(jsonStr);
          
          // Enrich the itinerary with real images
          const enrichedItinerary = await enrichItineraryWithImages(parsedResult);
          console.log("Generated itinerary with images:", enrichedItinerary);

          setData(prev => ({ ...prev, itineraryData: enrichedItinerary }));
          await addData(enrichedItinerary);

          toast.success("Itinerary generated successfully!");

          setLoading(false)
          
        } catch (error) {
          console.error("Error processing itinerary:", error);
          toast.error("Failed to process the itinerary. Please try again.");
        }

      } catch (error) {
        console.error("Error generating itinerary:", error);
        toast.error("Error generating itinerary. Please try again.");
      }
    }


  
  const [dialogOpen,setDialogOpen]=React.useState(false)

  const updateData=(item,value)=>{
    if(item === "days") {
      if (value === "") {
        // Allow empty value
        value = "";
      } else {
        const numValue = parseInt(value) || 1;
        value = Math.min(Math.max(1, numValue), 7);
      }
    }
    setData(prev=>({
      ...prev,
      [item]:value
    }))
  }

 


 


 
  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster/>
      
      <h1 className="font-bold text-3xl text-center mt-5 leading-15">Tell us your travel preferences</h1>
      <p className="text-muted-foreground text-center">Just provide us with a few details and we'll generate a list of places to visit based on your preferences.</p>
      <div className="flex flex-col justify-start items-center w-[45rem]  mt-15">
        <div className="w-[45rem]">
        <h3 className="font-bold mb-3">What is destination of choice?</h3>
        <GooglePlacesAutocomplete 
        className="w-full"
        onLoadFailed={(error)=>{console.log(error)}}
        apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''}
        selectProps={{
          placeholder:"Type destination",
          onChange:(data)=>{
            console.log(data)
            if (data?.label) {
              setData(prev=>({...prev,destination:data.label}))
              setOpen(false)
            }
          }
        }}
        />
      
        </div>
        <div className="mt-10">
        <h3 className="font-bold mb-3">How many days are you planning your trip?</h3>
        <Input 
          type="number" 
          value={data?.days || ""} 
          onChange={(e)=>updateData("days", e.target.value)} 
          className="w-[45rem]" 
          placeholder="ex.3(max 7)"
          min={1}
          max={7}
        />

        </div>
        <div className="mt-10">
        <h3 className="font-bold mb-3">How much money are you planning to spend?</h3>
        <div className="flex justify-start items-center gap-x-8  w-[45rem]">
        <CustomCard icon={<FcMoneyTransfer/>} selected={data?.budget==="Cheap"} title={"Cheap"} description="Stay conscious of costs" onClicked={()=>updateData("budget","Cheap")}/>
        <CustomCard icon={<GiPayMoney />} selected={data?.budget==="Moderate"} title={"Moderate"} description="Keep cost on the average side" onClicked={()=>updateData("budget","Moderate")}/>
        <CustomCard icon={<GiTakeMyMoney/>} selected={data?.budget==="Luxury"} title={"Luxury"} description="Dont worry about the cost" onClicked={()=>updateData("budget","Luxury")}/>

        </div>
        </div>
       

      </div>

     
        <div className="mt-10">
        <h3 className="font-bold mb-3">Who do you plan on travelling with on your next adventure?</h3>
        <div className="flex justify-start items-center gap-x-8  w-[45rem]">
        <CustomCard icon={<BsAirplaneEnginesFill/>} selected={data?.travellers==="single"} title={"Just me"} description="A sole traveles in exploration" onClicked={()=>updateData("travellers","single")}/>
        <CustomCard icon={<FaChampagneGlasses />} selected={data?.travellers==="couple"} title={"A couple"} description="Two travellers in tandem" onClicked={()=>updateData("travellers","couple")}/>
        <CustomCard icon={<MdFamilyRestroom/>} selected={data?.travellers==="family"} title={"Family"} description="Three or more people" onClicked={()=>updateData("travellers","family")}/>
        <CustomCard icon={<GiThreeFriends/>} selected={data?.travellers==="friends"} title={"Friends"} description="A bunch of thrill-seekers" onClicked={()=>updateData("travellers","friends")}/>


        </div>
        </div>
        <div className="my-8 flex justify-center w-[45rem] "> <Button className="cursor-pointer" disabled={loading} onClick={()=>{

if(!data?.budget || !data?.days || !data?.travellers || !data?.destination){
  toast("Please fill all the fields");
  return;
}
          const user=localStorage.getItem("user");
          if(!user){
            setDialogOpen(true);
            return;


          }

        
          generateItenary()

        }}>{loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Generate Trip"}</Button></div>
    
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="text-center">Login Required</AlertDialogTitle>
      <AlertDialogDescription>
      
        <Button className="bg-blue-500 w-full cursor-pointer" onClick={async ()=>{
          
          await googleSignIn()

          setDialogOpen(false)
          setCount(count+1)
          
          }} >Login with google</Button>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className="flex justify-center items-center ">
      <AlertDialogCancel className="mx-auto w-full cursor-pointer">Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


      </div>
      
    
  )
}

export default CreateTrip