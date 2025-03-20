import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

function CustomCard({ icon, title, description,selected,onClicked }) {
  return (
    <Card className={`hover:shadow-2xs text-center cursor-pointer ${selected && "border-2 border-ring"}`} onClick={onClicked}>
  <CardHeader>
    <CardTitle className="font-bold text-3xl flex justify-center">{icon}</CardTitle>
    <CardDescription className="font-bold text-black">{title}</CardDescription>
  </CardHeader>
  <CardContent>
    <p className='text-muted-foreground text-sm'>{description}</p>
  </CardContent>
 
</Card>

  )
}

export default CustomCard