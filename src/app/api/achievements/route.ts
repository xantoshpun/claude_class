import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [all, earned] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { xpReward: 'desc' } }),
    prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      include: { achievement: true },
    }),
  ])

  const earnedSlugs = new Set(earned.map((ua) => ua.achievement.slug))
  return NextResponse.json({
    achievements: all.map((a) => ({
      ...a,
      earned: earnedSlugs.has(a.slug),
      earnedAt: earned.find((ua) => ua.achievement.slug === a.slug)?.earnedAt ?? null,
    })),
  })
}
