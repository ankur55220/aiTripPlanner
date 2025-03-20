import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { googleSignIn } from '@/services/fireBaseConfig'
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


function Header() {
  const navigate=useNavigate();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const user=localStorage.getItem("user");


  

  

  const logout=()=>{
    localStorage.removeItem("user")
    setDialogOpen(false)
  }



  return (
    <div className='flex justify-between items-center w-full shadow-sm border-b px-4 md:px-10 py-4'>

        <div className='w-32 md:w-45 flex-shrink-0'>
            <img src="/logo.svg" alt="logo" className="w-full h-auto" />
        </div>
        <div className='flex items-center gap-2 flex-wrap justify-end'>
          {
            user && user!="undefined" &&
            (<div className="flex gap-2 flex-wrap">
              <Button className='cursor-pointer bg-yellow-800 text-sm md:text-base whitespace-nowrap' onClick={()=>navigate('/create-trip')}>Create trip</Button>
              <Button className='cursor-pointer bg-yellow-800 text-sm md:text-base whitespace-nowrap' onClick={()=>navigate('/generated-trips')}>Generated trips</Button>
            </div>)
          }
          {
            user && user!="undefined" ?
            <div className="flex-shrink-0">
              <img className='w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer' src={JSON.parse(user).picture} alt="profile" onClick={()=>setDialogOpen(true)}/>
            </div>:
            <Button onClick={()=>setDialogOpen(true)} className="cursor-pointer text-sm md:text-base whitespace-nowrap">Sign in</Button>
          }
        </div>

        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="text-center">{user && user!="undefined" ? "Logout" : "Login Required"}</AlertDialogTitle>
      <AlertDialogDescription>
      
        <Button className="bg-blue-500 w-full cursor-pointer" onClick={async()=>{
          if(user && user!="undefined"){
            logout()
          }
          else{
            await googleSignIn()
            setDialogOpen(false)
            setCount(count+1)
          }
          }} >{user && user!="undefined" ? "Logout" : "Login with google"}</Button>
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

export default Header