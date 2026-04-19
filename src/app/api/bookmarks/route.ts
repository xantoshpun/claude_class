import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkAndAwardAchievements } from '@/lib/achievements'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ bookmarks })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleSlug, lessonSlug } = await req.json()
  const userId = session.user.id

  const existing = await prisma.bookmark.findUnique({
    where: { userId_moduleSlug_lessonSlug: { userId, moduleSlug, lessonSlug } },
  })

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } })
    return NextResponse.json({ bookmarked: false })
  }

  await prisma.bookmark.create({ data: { userId, moduleSlug, lessonSlug } })

  const total = await prisma.bookmark.count({ where: { userId } })
  const newAchievements = await checkAndAwardAchievements(userId, { bookmarksCount: total })

  return NextResponse.json({ bookmarked: true, newAchievements })
}
