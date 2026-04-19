import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkAndAwardAchievements } from '@/lib/achievements'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json({ notes })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleSlug, lessonSlug, content } = await req.json()
  const userId = session.user.id

  const note = await prisma.note.upsert({
    where: { userId_moduleSlug_lessonSlug: { userId, moduleSlug, lessonSlug } },
    update: { content },
    create: { userId, moduleSlug, lessonSlug, content },
  })

  const totalNotes = await prisma.note.count({ where: { userId } })
  const newAchievements = await checkAndAwardAchievements(userId, { notesWritten: totalNotes })

  return NextResponse.json({ note, newAchievements })
}
