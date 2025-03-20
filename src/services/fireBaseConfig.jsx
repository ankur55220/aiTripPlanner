// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth,GoogleAuthProvider,signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYUFJkaLKmRnXVkpeIRH1p4Feu_mzqkFs",
  authDomain: "aitrip-82273.firebaseapp.com",
  projectId: "aitrip-82273",
  storageBucket: "aitrip-82273.firebasestorage.app",
  messagingSenderId: "387604953119",
  appId: "1:387604953119:web:10fc6ce1cd5ff1e1e37d2a",
  measurementId: "G-7529Q16K24"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

export async function googleSignIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User signed in:", user);
//     email
// : 
// "ankur55420@gmail.com"
// email_verified
// : 
// true
// given_name
// : 
// "Ankur"
// name
// : 
// "Ankur"
// picture
// : 
// "https://lh3.googleusercontent.com/a/ACg8ocLyupvDawOqrFAZaPtGX6GLWF2wCzRVSx6fxbTLkrqddEzHh15t=s96-c"
// sub
// : 
// "116115946762126383733"

const data={
  email:user.email,
  email_verified:user.emailVerified,
  given_name:user.displayName,
  name:user.displayName,
  picture:user.photoURL
}
    
localStorage.setItem("user",JSON.stringify(data))
    
    
    // Access user data here (e.g., user.uid, user.email, user.displayName)
    // Redirect to the appropriate page after successful sign-in.
  } catch (error) {
    console.error("Error signing in:", error);
    // Handle sign-in errors appropriately (e.g., display an error message to the user)
  }
}


