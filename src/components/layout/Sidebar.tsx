'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { modules } from '@/content/modules'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, ChevronDown, ChevronRight, BookOpen } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  progress?: Record<string, Record<string, { completed: boolean }>>
}

export function Sidebar({ progress = {} }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  function toggleModule(slug: string) {
    setCollapsed((prev) => ({ ...prev, [slug]: !prev[slug] }))
  }

  function isModuleActive(moduleSlug: string) {
    return pathname.includes(moduleSlug)
  }

  function getLessonProgress(moduleSlug: string, lessonSlug: string) {
    return progress[moduleSlug]?.[lessonSlug]?.completed ?? false
  }

  function getModuleCompletion(moduleSlug: string) {
    const mod = modules.find((m) => m.slug === moduleSlug)
    if (!mod) return 0
    const completed = mod.lessons.filter((l) => getLessonProgress(moduleSlug, l.slug)).length
    return Math.round((completed / mod.lessons.length) * 100)
  }

  return (
    <aside className="w-64 border-r border-border bg-card h-full overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Claude Academy</span>
        </Link>

        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === '/dashboard'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/courses"
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === '/courses'
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            All Courses
          </Link>
        </nav>

        <div className="mt-6 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Modules</p>
          {modules.map((mod) => {
            const pct = getModuleCompletion(mod.slug)
            const isOpen = isModuleActive(mod.slug) || !collapsed[mod.slug]

            return (
              <div key={mod.slug}>
                <button
                  onClick={() => toggleModule(mod.slug)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    isModuleActive(mod.slug)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <span className="text-base">{mod.icon}</span>
                  <span className="flex-1 truncate">{mod.title}</span>
                  {pct === 100 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  ) : pct > 0 ? (
                    <span className="text-xs text-muted-foreground flex-shrink-0">{pct}%</span>
                  ) : null}
                  {isOpen ? (
                    <ChevronDown className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {mod.lessons.map((lesson) => {
                      const done = getLessonProgress(mod.slug, lesson.slug)
                      const isActive = pathname === `/courses/${mod.slug}/${lesson.slug}`
                      return (
                        <Link
                          key={lesson.slug}
                          href={`/courses/${mod.slug}/${lesson.slug}`}
                          className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          )}
                        >
                          {done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 flex-shrink-0 opacity-40" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      )
                    })}
                    <Link
                      href={`/quiz/${mod.quizId}`}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors mt-1',
                        pathname === `/quiz/${mod.quizId}`
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      <span>📝</span>
                      <span>Module Quiz</span>
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 border-t border-border pt-4 space-y-1">
          <Link href="/playground" className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors', pathname === '/playground' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>
            🧪 Playground
          </Link>
          <Link href="/achievements" className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors', pathname === '/achievements' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>
            🏆 Achievements
          </Link>
          <Link href="/notes" className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors', pathname === '/notes' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}>
            📓 My Notes
          </Link>
        </div>
      </div>
    </aside>
  )
}
