import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getQuiz } from '@/content/quizzes'
import { checkAndAwardAchievements } from '@/lib/achievements'
import { getLevelFromXP } from '@/lib/utils'

interface Answer {
  questionId: string
  selectedOption: string
}

export async function POST(req: NextRequest, { params }: { params: { quizId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const quiz = getQuiz(params.quizId)
  if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })

  const { answers }: { answers: Answer[] } = await req.json()
  const userId = session.user.id

  let score = 0
  const results = quiz.questions.map((q) => {
    const given = answers.find((a) => a.questionId === q.id)
    const correct = given?.selectedOption === q.correctOption
    if (correct) score++
    return { questionId: q.id, selectedOption: given?.selectedOption ?? null, correct, explanation: q.explanation, correctOption: q.correctOption }
  })

  const total = quiz.questions.length
  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= quiz.passingScore

  const xpEarned = passed ? quiz.xpReward : Math.floor(quiz.xpReward * 0.3)

  await prisma.quizAttempt.create({
    data: { userId, quizId: quiz.id, score, total, passed, answers: JSON.stringify(answers), xpEarned },
  })

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: xpEarned } },
  })
  const newLevel = getLevelFromXP(updatedUser.xp)
  if (newLevel !== updatedUser.level) {
    await prisma.user.update({ where: { id: userId }, data: { level: newLevel } })
  }

  const totalQuizAttempts = await prisma.quizAttempt.count({ where: { userId } })
  const newAchievements = await checkAndAwardAchievements(userId, {
    quizScore: score,
    quizTotal: total,
  })
  if (totalQuizAttempts === 1) newAchievements.push('first-quiz')

  return NextResponse.json({ score, total, percentage, passed, results, xpEarned, newAchievements })
}
