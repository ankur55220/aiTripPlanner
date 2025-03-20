import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/services/fireBaseConfig'

const user=localStorage.getItem("user")
function GenerateTrips() {
    const navigate=useNavigate()

    const [data,setData]=React.useState([])

    const getAllTrips=async()=>{
        const docRef=collection(db,"trips")
        const docSnap=await getDocs(docRef)
        if(docSnap.docs.length>0){
          console.log(docSnap.docs)
          setData(docSnap.docs.map(doc=>({id:doc.id,...doc.data()})))
        }
        
    }
    useEffect(()=>{

        if(!user){
            navigate('/')
        }
        getAllTrips()
    },[])

  return (
    <div className='m-10'>
        <h2 className='text-2xl font-bold mb-4' onClick={()=>{console.log(data)}}>Generated trips</h2>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {data.map((trip,idx)=>{
                console.log(trip)
                return(
                    <div key={idx} className='p-4 border rounded-lg cursor-pointer' onClick={()=>{navigate(`/view-trip/${trip.id}`)}}>
                         <div className='w-[270px] h-[200px] overflow-hidden'>
            <img src={trip?.tripData?.destination?.image_url || '/placeholder.jpg'} alt="" className='w-full h-full object-cover' />
        </div>
                        <h3 className='text-lg font-bold'>{trip.tripData.destination.name}</h3>
                        <p className='text-sm text-gray-500'>{`Iternary for ${trip.userChoice.destination} for ${trip.userChoice.travellers} for ${trip.userChoice.days} days with budget ${trip.userChoice.budget}`}</p>
                    </div>
                )
            })}
        </div>
        
    </div>
  )
}

export default GenerateTrips