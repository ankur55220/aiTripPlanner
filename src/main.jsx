import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './create-trip'
import Header from './components/Custom/Header'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ViewTrip from './view-trip/[tripId]'
import GenerateTrips from './generatedTrips'

const router=createBrowserRouter([
  {
    path:'/',
    element: (
      <>
        <Header />
        <App />
      </>
    )
  },
  {
    path:'/create-trip',
    element: (
      <>
        <Header />
        <CreateTrip />
      </>
    )
  },
  {
    path:'/view-trip/:tripId',
    element: (
      <>
        <Header />
        <ViewTrip />
      </>
    )
  },
  {
    path:'/generated-trips',
    element: (
      <>
        <Header />
        <GenerateTrips />
      </>
    )
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>,
)
