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
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [input, setInput] = useState("")
  const [dane, setDane] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
    }
  }, [user, loading]);

  if (loading) return <div className="m-0 w-full h-screen bg-cover bg-center bg-white flex items-center justify-center text-9xl text-white/50"><p>Loading...</p></div>;
  if (!user) return null;

  const onfirst = async () => {
    try {
      if (questionCount >= 10) {
        // Reset quiz after 10 questions
        setQuestionCount(0);
        setScore(0);
        setDane(null);
        return;
      }

      setSelectedAnswer(null);
      const data = await fetch('http://192.168.15.34:5678/webhook/question', {
        headers: { "topic": `${input}` }
      });
      const json = await data.json();
      setDane(json[0].output);
      setQuestionCount(prev => prev + 1);
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
      if (answerId === dane.correct) {
        setScore(prev => prev + 1);
      }
    }
  };

  return (
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
        >{questionCount >= 10 ? "Restart Quiz" : "Submit"}</Button>

        <button className="bg-zinc-500 rounded-full w-20 h-20 flex items-center justify-center absolute left-[3%] bottom-[3%] cursor-pointer hover:bg-zinc-600">
          <LogOut onClick={logout} className="w-[80%] h-[80%] stroke-[1.5]"></LogOut>
        </button>
      </main>

      <aside className="w-[60%] h-screen p-4 overflow-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Question {Math.min(questionCount, 10)}/10</span>
            <span className="text-sm font-medium">Score: {score}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${(questionCount / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {questionCount >= 10 ? (
          <div className="text-center mt-10">
            <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-xl">Your final score: {score}/10</p>
            <Button onClick={onfirst} className="mt-4">Start New Quiz</Button>
          </div>
        ) : dane ? (
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

        {selectedAnswer !== null && questionCount < 10 && (
          <div className="mt-4">
            <Button onClick={onfirst}>Next Question</Button>
          </div>
        )}
      </aside>
    </div>
  )
}