import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkAndAwardAchievements } from '@/lib/achievements'
import { getLevelFromXP, getTodayString } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  moduleSlug: z.string(),
  lessonSlug: z.string(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id, completed: true },
    select: { moduleSlug: true, lessonSlug: true, completedAt: true },
  })

  const progress: Record<string, Record<string, { completed: boolean; completedAt: string | null }>> = {}
  for (const row of rows) {
    if (!progress[row.moduleSlug]) progress[row.moduleSlug] = {}
    progress[row.moduleSlug][row.lessonSlug] = {
      completed: true,
      completedAt: row.completedAt?.toISOString() ?? null,
    }
  }

  return NextResponse.json({ progress })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { moduleSlug, lessonSlug } = schema.parse(body)
  const userId = session.user.id

  await prisma.lessonProgress.upsert({
    where: { userId_moduleSlug_lessonSlug: { userId, moduleSlug, lessonSlug } },
    update: { completed: true, completedAt: new Date() },
    create: { userId, moduleSlug, lessonSlug, completed: true, completedAt: new Date() },
  })

  // Award XP
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: 10 } },
  })
  const newLevel = getLevelFromXP(updatedUser.xp)
  if (newLevel !== updatedUser.level) {
    await prisma.user.update({ where: { id: userId }, data: { level: newLevel } })
  }

  // Record streak day
  const today = getTodayString()
  await prisma.streakDay.upsert({
    where: { userId_date: { userId, date: today } },
    update: {},
    create: { userId, date: today },
  })

  // Compute streak
  const streakDays = await prisma.streakDay.findMany({ where: { userId }, orderBy: { date: 'desc' } })
  let streak = 0
  let expected = today
  for (const day of streakDays) {
    if (day.date === expected) {
      streak++
      const d = new Date(expected)
      d.setDate(d.getDate() - 1)
      expected = d.toISOString().split('T')[0]
    } else break
  }

  // Count total completed and today's completions
  const totalCompleted = await prisma.lessonProgress.count({ where: { userId, completed: true } })
  const todayCompletions = await prisma.lessonProgress.count({
    where: { userId, completed: true, completedAt: { gte: new Date(today) } },
  })

  const newAchievements = await checkAndAwardAchievements(userId, {
    totalLessonsCompleted: totalCompleted,
    lessonsCompletedToday: todayCompletions,
    streakDays: streak,
  })

  return NextResponse.json({ ok: true, xp: updatedUser.xp + 10, newAchievements })
}
