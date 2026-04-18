import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getModule, getNextLesson, getPrevLesson } from '@/content/modules'
import { LessonContent } from '@/components/lesson/LessonContent'
import { LessonActions } from '@/components/lesson/LessonActions'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import path from 'path'
import fs from 'fs'

async function getLessonMDX(moduleSlug: string, lessonSlug: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'src/content', moduleSlug, `${lessonSlug}.mdx`)
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return ''
  }
}

export default async function LessonPage({
  params,
}: {
  params: { moduleSlug: string; lessonSlug: string }
}) {
  const { moduleSlug, lessonSlug } = params
  const mod = getModule(moduleSlug)
  if (!mod) notFound()

  const lesson = mod.lessons.find((l) => l.slug === lessonSlug)
  if (!lesson) notFound()

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  const [mdxContent, progress, note] = await Promise.all([
    getLessonMDX(moduleSlug, lessonSlug),
    userId
      ? prisma.lessonProgress.findUnique({
          where: { userId_moduleSlug_lessonSlug: { userId, moduleSlug, lessonSlug } },
        })
      : null,
    userId
      ? prisma.note.findUnique({
          where: { userId_moduleSlug_lessonSlug: { userId, moduleSlug, lessonSlug } },
        })
      : null,
  ])

  const isCompleted = progress?.completed ?? false

  const nextLesson = getNextLesson(moduleSlug, lessonSlug)
  const prevLesson = getPrevLesson(moduleSlug, lessonSlug)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/courses" className="hover:text-foreground transition-colors">Courses</Link>
        <span>/</span>
        <Link href={`/courses/${moduleSlug}`} className="hover:text-foreground transition-colors">{mod.title}</Link>
        <span>/</span>
        <span className="text-foreground">{lesson.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{mod.icon}</span>
          <span className="text-sm text-muted-foreground">{mod.title}</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">{lesson.title}</h1>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {lesson.estimatedMinutes} min read
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {lesson.difficulty}
          </span>
          {isCompleted && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
              ✓ Completed
            </span>
          )}
        </div>
      </div>

      {/* MDX Content */}
      <div className="prose max-w-none mb-10">
        <LessonContent content={mdxContent} />
      </div>

      {/* Actions */}
      {userId && (
        <LessonActions
          moduleSlug={moduleSlug}
          lessonSlug={lessonSlug}
          isCompleted={isCompleted}
          initialNote={note?.content ?? ''}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-8 border-t border-border">
        {prevLesson ? (
          <Link
            href={`/courses/${prevLesson.moduleSlug}/${prevLesson.lesson.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{prevLesson.lesson.title}</span>
          </Link>
        ) : <div />}

        {nextLesson ? (
          <Link
            href={`/courses/${nextLesson.moduleSlug}/${nextLesson.lesson.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
          >
            <span>{nextLesson.lesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/quiz/${mod.quizId}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors text-sm font-medium"
          >
            <span>Take Module Quiz</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
