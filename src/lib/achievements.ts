import { prisma } from './prisma'
import { getLevelFromXP } from './utils'

interface AchievementContext {
  lessonsCompletedToday?: number
  totalLessonsCompleted?: number
  streakDays?: number
  quizScore?: number
  quizTotal?: number
  playgroundUsed?: boolean
  notesWritten?: number
  bookmarksCount?: number
  moduleCompleted?: string
  allModulesCompleted?: boolean
}

export async function checkAndAwardAchievements(
  userId: string,
  context: AchievementContext
): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: { include: { achievement: true } },
    },
  })
  if (!user) return []

  const earned = new Set(user.achievements.map((ua) => ua.achievement.slug))
  const toAward: string[] = []

  const check = (slug: string, condition: boolean) => {
    if (condition && !earned.has(slug)) toAward.push(slug)
  }

  check('first-lesson', (context.totalLessonsCompleted ?? 0) >= 1)
  check('speed-learner', (context.lessonsCompletedToday ?? 0) >= 5)
  check('streak-3', (context.streakDays ?? 0) >= 3)
  check('streak-7', (context.streakDays ?? 0) >= 7)
  check('streak-30', (context.streakDays ?? 0) >= 30)

  if (context.quizScore !== undefined && context.quizTotal !== undefined) {
    const isFirstQuiz = !earned.has('first-quiz')
    check('first-quiz', isFirstQuiz || true)
    check('perfect-quiz', context.quizScore === context.quizTotal && context.quizTotal > 0)
  }

  if (context.moduleCompleted) check('module-complete', true)
  check('all-complete', context.allModulesCompleted ?? false)
  check('first-playground', context.playgroundUsed ?? false)
  check('first-note', (context.notesWritten ?? 0) >= 1)
  check('bookmarker', (context.bookmarksCount ?? 0) >= 10)

  if (toAward.length === 0) return []

  const achievementRecords = await prisma.achievement.findMany({
    where: { slug: { in: toAward } },
  })

  let bonusXP = 0
  for (const ach of achievementRecords) {
    try {
      await prisma.userAchievement.create({
        data: { userId, achievementId: ach.id },
      })
      bonusXP += ach.xpReward
    } catch {
      // already earned
    }
  }

  if (bonusXP > 0) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: bonusXP } },
    })
    const newLevel = getLevelFromXP(updatedUser.xp)
    if (newLevel !== updatedUser.level) {
      await prisma.user.update({ where: { id: userId }, data: { level: newLevel } })
    }
  }

  return toAward
}
