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
import pb from "@/lib/pb";
import webhook from "@/lib/webhook"

export default function Home() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [input, setInput] = useState("")
  const [dane, setDane] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/Login");
    }
  }, [user, loading]);

  if (loading) return <div className="m-0 w-full h-screen bg-cover bg-center bg-white flex items-center justify-center text-9xl text-white/50"><p>Loading...</p></div>;
  if (!user) return null;

  const saveFullQuiz = async () => {
    try {
      if (!pb || !user || quizHistory.length === 0) return
      
      const data = {
        user: user.id,
        topic: input,
        score: score,
        total_questions: 10,
        responses: quizHistory // All questions with user answers
      }

      await pb.collection('pytania').create(data)
      console.log('Full quiz saved to PocketBase')
    } catch (err) {
      console.error('Error saving quiz:', err)
    }
  }

  const onfirst = async () => {
    try {
      if (questionCount >= 10) {
        await saveFullQuiz() // Save all data at quiz end
        setQuizHistory([]) // Clear history
        setQuestionCount(0)
        setScore(0)
        setDane(null)
        return
      }

      setSelectedAnswer(null)
      const data = await fetch(webhook, {
        headers: { "topic": `${input}` }
      })
      const json = await data.json()
      setDane(json[0].output)
      setQuestionCount(prev => prev + 1)
    } catch (err) {
      console.log(err)
    }
  }

  const handleAnswerClick = (answerId) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answerId)
      const isCorrect = answerId === dane.correct
      if (isCorrect) setScore(prev => prev + 1)

      // Store question data in history
      setQuizHistory(prev => [
        ...prev,
        {
          question: dane.question,
          answers: dane.answers,
          correct_answer: dane.correct,
          user_answer: answerId,
          is_correct: isCorrect,
          question_number: questionCount
        }
      ])
    }
  }

   const handleChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className="m-0 w-full h-screen bg-cover bg-center bg-white flex flex-row">
      <main className="w-[40%] h-screen bg-zinc-700 flex flex-col justify-center text-center pb-[5%] gap-5" >
        <h1 className="text-white font-mono font-bold absolute left-[1%] top-[1%]">Welcome {user.username}</h1>
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
        <div className="absolute right-[2%] bottom-[5%]">
              <Button className="bg-zinc-600 hover:bg-zinc-800 cursor-pointer"><Link href="/history">Your history</Link></Button>
            </div>
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