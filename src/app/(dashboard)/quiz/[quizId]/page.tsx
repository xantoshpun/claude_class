import { notFound } from 'next/navigation'
import { getQuiz } from '@/content/quizzes'
import { QuizRunner } from '@/components/quiz/QuizRunner'

export default function QuizPage({ params }: { params: { quizId: string } }) {
  const quiz = getQuiz(params.quizId)
  if (!quiz) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <QuizRunner quiz={quiz} />
    </div>
  )
}
