import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { getTodayString } from '@/lib/utils'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const userId = session.user.id

  const [user, progressRows, streakRows] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { xp: true, level: true } }),
    prisma.lessonProgress.findMany({ where: { userId, completed: true }, select: { moduleSlug: true, lessonSlug: true, completedAt: true } }),
    prisma.streakDay.findMany({ where: { userId }, orderBy: { date: 'desc' } }),
  ])

  // Build progress map
  const progress: Record<string, Record<string, { completed: boolean }>> = {}
  for (const row of progressRows) {
    if (!progress[row.moduleSlug]) progress[row.moduleSlug] = {}
    progress[row.moduleSlug][row.lessonSlug] = { completed: true }
  }

  // Compute streak
  let streak = 0
  let expected = getTodayString()
  for (const day of streakRows) {
    if (day.date === expected) {
      streak++
      const d = new Date(expected)
      d.setDate(d.getDate() - 1)
      expected = d.toISOString().split('T')[0]
    } else break
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar progress={progress} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar xp={user?.xp ?? 0} level={user?.level ?? 1} streak={streak} />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
