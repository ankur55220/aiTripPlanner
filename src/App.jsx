
import './App.css'
import { Button } from './components/ui/button'
import { useNavigate } from 'react-router-dom'

function App() {
 const navigate=useNavigate();

  return (
    
      <div>
      
        <div className='px-10 text-center flex flex-col items-center justify-center gap-10'>
        <h1 className='mt-10 font-bold text-4xl leading-12'>
          <span className='text-yellow-800'>Discover Your Next Adventure with AI:</span><br></br> Personalized Iternaries at your Fingertips
          
        </h1>
        <p className='max-w-2xl text-muted-foreground'>
          Your personal travel companion powered by AI. Plan your perfect trip, from the moment you start to the moment you arrive.iternaries tailored to your interests, budget, and preferences. Get personalized itineraries, travel tips, and expert recommendations to help you make the most of your trip.
        </p>
        <Button className='cursor-pointer' onClick={()=>navigate('/create-trip')}>Get Started,It's Free!</Button>
        </div>
       
       
      </div>
     
    
  )
}

export default App
