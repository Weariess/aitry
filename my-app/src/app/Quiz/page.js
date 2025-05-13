"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react";
import { LogOut } from 'lucide-react';




export default function Home() {

  const { user, logout, loading } = useAuth(); // Don't destructure directly
  const router = useRouter();
  const [input,setInput]=useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
    }
  }, [user, loading]);

  if (loading) return <div className="m-0 w-full h-screen bg-cover bg-center bg-white flex items-center justify-center text-9xl text-white/50"><p>Loading...</p></div>;

  if (!user) return null; // Prevent flicker

  console.log(user)

  const onfirst = async ()=>{
    try {
      const data = await fetch('http://192.168.15.34:5678//webhook-test/question',{headers:{"topic":`${input}`}})
      const json = await data.json()
      console.log(data)
      console.log(json)
    
    } catch (err) {
      console.log(err)
    }
   
  }
  const handleChange = (event) => {
    setInput(event.target.value);
  };
    

    return(
        <div className="m-0 w-full h-screen bg-cover bg-center bg-white flex flex-row">

        <main className="w-[40%] h-screen bg-zinc-700 flex flex-col justify-center pb-[5%]" >
        <Input
      type="text"
      value={input}
      onChange={handleChange}

      placeholder="Type something..."
    />
    <Button onClick={onfirst}>Submit</Button>
        </main>
            



    </div>
    )
  
}