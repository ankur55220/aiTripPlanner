import React from 'react'

function RenderItiniary({data}) {
  return (
    <div className='p-4 rounded-lg shadow-md'>
        <div className='w-full h-[200px] overflow-hidden'>
            <img src={data?.image_url || '/placeholder.jpg'} alt="" className='w-full h-full object-cover' />
        </div>
        <h2 className='text-sm font-bold'>{data?.name}</h2>
        <p className='text-sm text-gray-500'>{data?.description}</p>
    </div>
  )
}

export default RenderItiniary