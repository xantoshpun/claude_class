'use client'

import { useState } from 'react'
import type { Quiz } from '@/types/content'
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { modules } from '@/content/modules'

interface Answer {
  questionId: string
  selectedOption: string
}

interface QuizResult {
  questionId: string
  selectedOption: string | null
  correct: boolean
  explanation: string
  correctOption: string
}

type Stage = 'intro' | 'quiz' | 'result'

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [stage, setStage] = useState<Stage>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [results, setResults] = useState<QuizResult[]>([])
  const [score, setScore] = useState(0)
  const [passed, setPassed] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [showReview, setShowReview] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const mod = modules.find((m) => m.quizId === quiz.id)
  const question = quiz.questions[currentQ]

  function selectOption(optionId: string) {
    if (selected) return
    setSelected(optionId)
  }

  function nextQuestion() {
    if (!selected) return
    const newAnswers = [...answers, { questionId: question.id, selectedOption: selected }]
    setAnswers(newAnswers)
    setSelected(null)

    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      submitQuiz(newAnswers)
    }
  }

  async function submitQuiz(finalAnswers: Answer[]) {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/quiz/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      })
      const data = await res.json()
      setResults(data.results)
      setScore(data.score)
      setPassed(data.passed)
      setXpEarned(data.xpEarned)
      setStage('result')
      if (data.passed) toast.success(`Quiz passed! +${data.xpEarned} XP 🎉`)
    } catch {
      toast.error('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  function restart() {
    setStage('quiz')
    setCurrentQ(0)
    setAnswers([])
    setSelected(null)
    setResults([])
    setShowReview(false)
  }

  if (stage === 'intro') {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📝</div>
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-muted-foreground mb-2">{quiz.questions.length} questions · Passing score: {quiz.passingScore}%</p>
        <p className="text-muted-foreground mb-8">Earn up to {quiz.xpReward} XP</p>
        <button onClick={() => setStage('quiz')} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
          Start Quiz
        </button>
      </div>
    )
  }

  if (stage === 'result') {
    const pct = Math.round((score / quiz.questions.length) * 100)
    return (
      <div>
        <div className={`text-center py-10 rounded-2xl mb-6 ${passed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <div className="text-5xl mb-3">{passed ? '🎉' : '😅'}</div>
          <h2 className="text-2xl font-bold mb-1">{passed ? 'Passed!' : 'Not quite'}</h2>
          <div className="text-5xl font-bold my-3" style={{ color: pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : '#ef4444' }}>{pct}%</div>
          <p className="text-muted-foreground">{score}/{quiz.questions.length} correct · +{xpEarned} XP earned</p>
        </div>

        <div className="flex gap-3 justify-center mb-8">
          <button onClick={restart} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">
            <RotateCcw className="w-4 h-4" /> Retake
          </button>
          <button onClick={() => setShowReview(!showReview)} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors">
            {showReview ? 'Hide' : 'Review'} Answers
          </button>
          {mod && (
            <Link href={`/courses/${mod.slug}`} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
              <Trophy className="w-4 h-4" /> Back to Module
            </Link>
          )}
        </div>

        {showReview && (
          <div className="space-y-4">
            {results.map((r, i) => {
              const q = quiz.questions[i]
              return (
                <div key={r.questionId} className={`p-4 rounded-xl border ${r.correct ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {r.correct ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                    <p className="font-medium text-sm">{q.text}</p>
                  </div>
                  {!r.correct && (
                    <p className="text-xs text-muted-foreground ml-7 mb-1">
                      Your answer: <span className="text-red-500">{q.options.find(o => o.id === r.selectedOption)?.text ?? 'No answer'}</span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground ml-7 mb-1">
                    Correct: <span className="text-green-600 dark:text-green-400">{q.options.find(o => o.id === r.correctOption)?.text}</span>
                  </p>
                  <p className="text-xs text-muted-foreground ml-7 italic">{r.explanation}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Quiz stage
  const progress = ((currentQ) / quiz.questions.length) * 100

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentQ + 1} of {quiz.questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-4">
        <h2 className="text-lg font-semibold mb-6">{question.text}</h2>
        <div className="space-y-3">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => selectOption(opt.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                selected === opt.id
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : selected
                  ? 'border-border bg-muted/50 text-muted-foreground cursor-not-allowed'
                  : 'border-border hover:border-primary/50 hover:bg-accent cursor-pointer'
              }`}
            >
              <span className="font-mono mr-3 text-muted-foreground">{opt.id.toUpperCase()}.</span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={!selected || submitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          {submitting ? 'Submitting...' : currentQ < quiz.questions.length - 1 ? 'Next' : 'Finish'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
