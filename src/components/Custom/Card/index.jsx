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
    <Card className={`hover:shadow-2xs text-center cursor-pointer w-full h-full ${selected && "border-2 border-ring"}`} onClick={onClicked}>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="font-bold text-2xl md:text-3xl flex justify-center">{icon}</CardTitle>
        <CardDescription className="font-bold text-black text-sm md:text-base mt-2">{title}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
        <p className='text-muted-foreground text-xs md:text-sm'>{description}</p>
      </CardContent>
    </Card>
  )
}

export default CustomCard