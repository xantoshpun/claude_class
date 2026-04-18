import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { modules, getTotalLessons } from '@/content/modules'
import Link from 'next/link'
import { CheckCircle2, BookOpen, Zap, Trophy } from 'lucide-react'
import { getXPForCurrentLevel, getXPForNextLevel } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const userId = session!.user!.id!

  const [user, progressRows, recentActivity, earnedAchievements] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.lessonProgress.findMany({ where: { userId, completed: true } }),
    prisma.lessonProgress.findMany({ where: { userId, completed: true }, orderBy: { completedAt: 'desc' }, take: 5 }),
    prisma.userAchievement.count({ where: { userId } }),
  ])

  const totalLessons = getTotalLessons()
  const completedLessons = progressRows.length
  const overallPct = Math.round((completedLessons / totalLessons) * 100)

  const completedMap = new Set(progressRows.map((r) => `${r.moduleSlug}::${r.lessonSlug}`))

  const xpCurrent = getXPForCurrentLevel(user?.level ?? 1)
  const xpNext = getXPForNextLevel(user?.level ?? 1)
  const xpPct = xpNext > xpCurrent ? Math.round(((user?.xp ?? 0) - xpCurrent) / (xpNext - xpCurrent) * 100) : 100

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {session?.user?.name?.split(' ')[0] ?? 'Learner'} 👋</h1>
        <p className="text-muted-foreground mt-1">Continue your Claude learning journey</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><CheckCircle2 className="w-4 h-4" /> Lessons</div>
          <div className="text-2xl font-bold">{completedLessons}<span className="text-muted-foreground text-sm font-normal">/{totalLessons}</span></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><BookOpen className="w-4 h-4" /> Progress</div>
          <div className="text-2xl font-bold">{overallPct}%</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Zap className="w-4 h-4" /> Level</div>
          <div className="text-2xl font-bold">{user?.level ?? 1}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Trophy className="w-4 h-4" /> Badges</div>
          <div className="text-2xl font-bold">{earnedAchievements}</div>
        </div>
      </div>

      {/* XP bar */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Level {user?.level ?? 1} → {(user?.level ?? 1) + 1}</span>
          <span className="text-muted-foreground">{user?.xp ?? 0} / {xpNext} XP</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${xpPct}%` }} />
        </div>
      </div>

      {/* Module progress */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Modules</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {modules.map((mod) => {
            const done = mod.lessons.filter((l) => completedMap.has(`${mod.slug}::${l.slug}`)).length
            const pct = Math.round((done / mod.lessons.length) * 100)
            const nextLesson = mod.lessons.find((l) => !completedMap.has(`${mod.slug}::${l.slug}`))
            return (
              <Link key={mod.slug} href={nextLesson ? `/courses/${mod.slug}/${nextLesson.slug}` : `/courses/${mod.slug}`}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{mod.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate group-hover:text-primary transition-colors">{mod.title}</p>
                    <p className="text-xs text-muted-foreground">{done}/{mod.lessons.length} lessons</p>
                  </div>
                  {pct === 100 && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {recentActivity.map((row) => {
              const mod = modules.find((m) => m.slug === row.moduleSlug)
              const lesson = mod?.lessons.find((l) => l.slug === row.lessonSlug)
              return (
                <div key={`${row.moduleSlug}-${row.lessonSlug}`} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-lg">{mod?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{lesson?.title}</p>
                    <p className="text-xs text-muted-foreground">{mod?.title}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
