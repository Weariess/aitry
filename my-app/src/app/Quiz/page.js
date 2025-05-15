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
  const [dane,setDane]=useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null);


  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
    }
  }, [user, loading]);

  if (loading) return <div className="m-0 w-full h-screen bg-cover bg-center bg-white flex items-center justify-center text-9xl text-white/50"><p>Loading...</p></div>;

  if (!user) return null; // Prevent flicker

  console.log(user)

const onfirst = async () => {
  try {
    setSelectedAnswer(null);


    const data = await fetch('http://192.168.15.34:5678/webhook/question', {
      headers: { "topic": `${input}` }
    });
    const json = await data.json();
    console.log(json);
    setDane(json[0].output);
    console.log(dane)

    setSelectedAnswer(null);

  } catch (err) {
    console.log(err);
  }
};
  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleAnswerClick = (answerId) => {
  if (selectedAnswer === null) {
    setSelectedAnswer(answerId);
  }
};

    

    return(
        <div className="m-0 w-full h-screen bg-cover bg-center bg-white flex flex-row">

        <main className="w-[40%] h-screen bg-zinc-700 flex flex-col justify-center text-center pb-[5%] gap-5" >
          <h1 className="text-white font-mono font-bold text-2xl">TYPE A TOPIC OF YOUR QUIZ</h1>
        <Input
        className="w-[70%] self-center"
      type="text"
      value={input}
      onChange={handleChange}

      placeholder="Type something..."
    />
    <Button onClick={onfirst}
    className="w-[70%] self-center"
    >Submit</Button>

        <button className="bg-zinc-500 rounded-full w-20 h-20 flex items-center justify-center absolute left-[3%] bottom-[3%] cursor-pointer hover:bg-zinc-600">
            <LogOut onClick={logout} className="w-[80%] h-[80%] stroke-[1.5]"></LogOut>
            </button>
        </main>


  <aside className="w-[60%] h-screen p-4 overflow-auto">
  {dane ? (
    <div>
      <h1 className="text-2xl font-bold mb-4">{dane.question}</h1>

      {/* ANSWERS */}
      <ul className="space-y-2">
        {dane.answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer.answer;
          const isCorrect = answer.answer === dane.correct;

          let bgColor = "bg-gray-200";
          if (selectedAnswer !== null) {
            if (isCorrect) bgColor = "bg-green-300";
            else if (isSelected) bgColor = "bg-red-300";
          } else if (isSelected) {
            bgColor = "bg-blue-300";
          }

          return (
            <li
              key={index}
              className={`p-2 rounded cursor-pointer ${bgColor} transition-colors`}
              onClick={() => handleAnswerClick(answer.answer)}
            >
              {answer.text}
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    <p className="text-gray-500">Submit a topic to see results</p>
  )}

  {selectedAnswer !== null && (
  <div className="mt-4">
    <Button onClick={onfirst}>Next Question</Button>
  </div>
)}
</aside>



            



    </div>
    )
  
}