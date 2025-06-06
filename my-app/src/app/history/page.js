"use client"

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from "../context/AuthContext"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import pb from '@/lib/pb'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function HistoryPage() {
  pb.autoCancellation(false)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState("all")
  const { user } = useAuth()
  const router = useRouter()

  // Get unique topics for filter dropdown
  const topics = useMemo(() => {
    const allTopics = quizzes.map(q => q.topic)
    return ['all', ...new Set(allTopics)]
  }, [quizzes])

  // Filter quizzes based on selected topic
  const filteredQuizzes = useMemo(() => {
    if (selectedTopic === "all") return quizzes
    return quizzes.filter(quiz => quiz.topic === selectedTopic)
  }, [quizzes, selectedTopic])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchQuizzes = async () => {
      try {
        const records = await pb.collection('pytania').getFullList({
          filter: `user = "${user.id}"`,
          sort: '-created',
          expand: 'responses' // Ensure nested data is loaded
        })
        setQuizzes(records)
      } catch (err) {
        console.error('Failed to fetch history:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [user])

  if (loading) return <div className="p-4">Loading history...</div>

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold ml-4">Your Quiz History</h1>
        </div>
        
        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map(topic => (
              <SelectItem key={topic} value={topic}>
                {topic === "all" ? "All Topics" : topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {selectedTopic === "all" 
              ? "No quiz history yet" 
              : `No quizzes found for "${selectedTopic}"`}
          </p>
          <Link href="/Quiz">
            <Button>Take a Quiz</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">
                  Topic: {quiz.topic}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  quiz.score >= 7 ? 'bg-green-100 text-green-800' : 
                  quiz.score >= 4 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  Score: {quiz.score}/{quiz.total_questions}
                </span>
              </div>

              <div className="space-y-6">
                {quiz.responses.map((response, idx) => (
                  <div key={idx} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-medium mb-2">
                      Q{idx + 1}: {response.question}
                    </h3>
                    <ul className="space-y-2">
                      {response.answers.map((answer, ansIdx) => {
                        const isUserAnswer = answer.answer === response.user_answer
                        const isCorrectAnswer = answer.answer === response.correct_answer
                        
                        return (
                          <li 
                            key={ansIdx}
                            className={`p-2 rounded ${
                              isCorrectAnswer ? 'bg-green-50 border border-green-200' : 
                              isUserAnswer ? 'bg-red-50 border border-red-200' : 
                              'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-2 font-medium">{String.fromCharCode(65 + ansIdx)}.</span>
                              {answer.text}
                              {isCorrectAnswer && (
                                <span className="ml-2 text-green-600 text-sm">✓ Correct</span>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <span className="ml-2 text-red-600 text-sm">✗ Your answer</span>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}