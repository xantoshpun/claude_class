import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getModule } from '@/content/modules'
import Link from 'next/link'
import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react'

export default async function ModulePage({ params }: { params: { moduleSlug: string } }) {
  const mod = getModule(params.moduleSlug)
  if (!mod) notFound()

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  const progressRows = userId
    ? await prisma.lessonProgress.findMany({ where: { userId, moduleSlug: mod.slug, completed: true } })
    : []

  const completedSet = new Set(progressRows.map((r) => r.lessonSlug))
  const done = progressRows.length
  const pct = Math.round((done / mod.lessons.length) * 100)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/courses" className="hover:text-foreground transition-colors">Courses</Link>
        <span>/</span>
        <span className="text-foreground">{mod.title}</span>
      </div>

      <div className="mb-8">
        <div className="text-5xl mb-4">{mod.icon}</div>
        <h1 className="text-3xl font-bold mb-2">{mod.title}</h1>
        <p className="text-muted-foreground mb-4">{mod.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-4 h-4" />{mod.estimatedMinutes}m total</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            mod.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            mod.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>{mod.difficulty}</span>
          <span className="text-muted-foreground">{done}/{mod.lessons.length} completed</span>
        </div>
      </div>

      {done > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{pct}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div className="space-y-2 mb-8">
        {mod.lessons.map((lesson, i) => {
          const isCompleted = completedSet.has(lesson.slug)
          return (
            <Link
              key={lesson.slug}
              href={`/courses/${mod.slug}/${lesson.slug}`}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted text-sm font-mono font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {i + 1}
              </div>
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium group-hover:text-primary transition-colors">{lesson.title}</p>
                {lesson.description && <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{lesson.estimatedMinutes}m</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="font-semibold">Module Quiz</p>
          <p className="text-sm text-muted-foreground">Test your knowledge · Up to {mod.xpReward} XP</p>
        </div>
        <Link
          href={`/quiz/${mod.quizId}`}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          Take Quiz
        </Link>
      </div>
    </div>
  )
}
