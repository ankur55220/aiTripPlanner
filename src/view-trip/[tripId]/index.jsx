import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/services/fireBaseConfig'
import Destination from '@/components/View-trip/Destination'
import Itiniary from '@/components/View-trip/Itiniary'
import Hotels from '@/components/View-trip/Hotels'
import Footer from '@/components/View-trip/Footer'
function ViewTrip() {
    const {tripId}=useParams()
    const [fetchedData,setFetchedData]=React.useState({})


    const getTripData=async()=>{

      const docRef=doc(db,"trips",tripId)
      const docSnap=await getDoc(docRef)
      if(docSnap.exists()){
        console.log(docSnap.data())
        setFetchedData(docSnap.data())
      }
    }

    useEffect(()=>{
      getTripData()

      
        
    },[])
  return (
    <div className='m-10 w-[95%] flex flex-col gap-10 justify-center align-center'>
<Destination data={fetchedData?.tripData}/>
<Hotels data={fetchedData?.tripData?.hotels}/>
<Itiniary data={fetchedData?.tripData?.daily_itinerary}/>

<Footer data={fetchedData?.tripData}/>
    </div>
  )
}

export default ViewTrip