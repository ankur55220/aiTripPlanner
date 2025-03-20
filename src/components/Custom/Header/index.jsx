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
    <div className='flex justify-between items-center w-full shadow-sm border-b px-10 py-4'>

        <div className='w-45'>
            <img src="/logo.svg" alt="logo"   />
        </div>
        <div className='flex gap-2'>
          {
            user && user!="undefined" &&
            (<>
            <Button className='cursor-pointer bg-yellow-800 ' onClick={()=>navigate('/create-trip')}>Create trip</Button>
            <Button className='cursor-pointer bg-yellow-800' onClick={()=>navigate('/generated-trips')}>My trips</Button>
            </>)
            
          }
          {
            user && user!="undefined" ?
            <div>
              <img className='w-10 h-10 rounded-full cursor-pointer' src={JSON.parse(user).picture} alt="profile" onClick={()=>setDialogOpen(true)}/>
              
            </div>:
            <Button onClick={()=>setDialogOpen(true)} className="cursor-pointer">Sign in</Button>
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