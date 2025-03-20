import React from 'react'
import RenderItiniary from './RenderItiniary'

function Itiniary({data}) {
  return (
    <div>
        <h2 className='text-xl font-bold mb-10'>Itinerary</h2>
        <div>
            {
                data?.map((item)=>{
                    return(
                        <div key={item.day} className='mb-10'>
                            <h3 className='text-lg font-bold mb-2'>Day {item.day}</h3>
                            <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4'>
                                {
                                    item?.places?.map((place)=>{
                                        return(
                                            <RenderItiniary key={place.name} data={place}/>
                                        )
                                    })
                                }
                            </div>
                           
                        </div>
                    )
                })
            }
            
        </div>
    </div>
  )
}

export default Itiniary