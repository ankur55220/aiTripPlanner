import React from 'react'

function Destination({data}) {
  return (
    <div className='border-1 border-gray-200 flex flex-col justify-center items-center w-full min-h-[200px] p-4'>
        <div className='w-[500px] h-[200px] overflow-hidden'>
            <img src={data?.destination?.image_url || '/placeholder.jpg'} alt="" className='w-full h-full object-cover' />
        </div>
        <h2 className='text-2xl font-bold'>{data?.destination?.name}</h2>
        <h2 className='text-sm text-orange-400'>{data?.destination?.best_time_to_visit}</h2>
    </div>
  )
}

export default Destination