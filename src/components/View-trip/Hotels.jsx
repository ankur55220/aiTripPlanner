import React from 'react'

function Hotels({data}) {
    const openInGoogleMaps = (hotel) => {
       
            // Fall back to search using name and address for better accuracy
            const searchQuery = encodeURIComponent(`${hotel.name} ${hotel.address}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
        
    };
  return (
    <div>
    <h2 className='text-xl font-bold mb-2'>Recommended hotels</h2>
    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 '>

    
    {data?.map((hotel) => (
      <div  key={hotel.name} className='shadow-md p-2 cursor-pointer' onClick={()=>openInGoogleMaps(hotel)}>
        <div className='w-full h-[200px] overflow-hidden'>
            <img src={hotel.image_url || '/placeholder.jpg'} alt="" className='w-full h-full object-cover' />
        </div>
        <h2 className='text-sm font-bold'>{hotel.name}</h2>
        <p className='text-sm text-gray-500'>📍 {hotel.address}</p>
        <p className='text-sm text-gray-500 my-2'>{hotel.description}</p>
        <h3 className='text-sm font-bold'>Amenities</h3>
        <ul>
          {hotel.amenities.map((amenity) => (
            <li key={amenity} className='text-sm text-gray-500'>{amenity}</li>
          ))}
        </ul>
        <h3 className='text-sm font-bold'>Price</h3>
        <p className='text-sm text-gray-500'>💳 {hotel.price_per_night} per night</p>
        <h3 className='text-sm font-bold mt-2'>Rating</h3>
        <p className='text-sm text-gray-500'>⭐ {hotel.rating} stars</p>
        
      </div>
    ))}
    </div>

    </div>
  )
}

export default Hotels