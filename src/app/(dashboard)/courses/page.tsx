import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { modules } from '@/content/modules'
import Link from 'next/link'
import { CheckCircle2, Clock } from 'lucide-react'

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)
  const userId = session!.user!.id!

  const progressRows = await prisma.lessonProgress.findMany({ where: { userId, completed: true } })
  const completedMap = new Set(progressRows.map((r) => `${r.moduleSlug}::${r.lessonSlug}`))

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">All Courses</h1>
        <p className="text-muted-foreground mt-1">8 modules covering everything about Claude</p>
      </div>

      <div className="space-y-4">
        {modules.map((mod) => {
          const done = mod.lessons.filter((l) => completedMap.has(`${mod.slug}::${l.slug}`)).length
          const pct = Math.round((done / mod.lessons.length) * 100)
          const nextLesson = mod.lessons.find((l) => !completedMap.has(`${mod.slug}::${l.slug}`))

          return (
            <div key={mod.slug} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{mod.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h2 className="text-lg font-semibold">{mod.title}</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">{mod.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{mod.estimatedMinutes}m</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{done}/{mod.lessons.length}</span>
                    {pct === 100 && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={nextLesson ? `/courses/${mod.slug}/${nextLesson.slug}` : `/courses/${mod.slug}`}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      {pct === 0 ? 'Start' : pct === 100 ? 'Review' : 'Continue'}
                    </Link>
                    <Link
                      href={`/quiz/${mod.quizId}`}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                    >
                      📝 Quiz
                    </Link>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      mod.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      mod.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {mod.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
