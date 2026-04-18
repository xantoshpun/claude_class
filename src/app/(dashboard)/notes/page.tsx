import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { modules } from '@/content/modules'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function NotesPage() {
  const session = await getServerSession(authOptions)
  const userId = session!.user!.id!

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <p className="text-muted-foreground mt-1">{notes.length} notes across your lessons</p>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-4">📓</div>
          <p className="text-lg font-medium mb-2">No notes yet</p>
          <p className="text-sm">Open any lesson and click "My Notes" to start taking notes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => {
            const mod = modules.find((m) => m.slug === note.moduleSlug)
            const lesson = mod?.lessons.find((l) => l.slug === note.lessonSlug)
            return (
              <Link
                key={note.id}
                href={`/courses/${note.moduleSlug}/${note.lessonSlug}`}
                className="block bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{mod?.icon}</span>
                  <span className="text-xs text-muted-foreground">{mod?.title} → {lesson?.title}</span>
                </div>
                <p className="text-sm line-clamp-3 text-foreground/80">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">Updated {formatDate(note.updatedAt)}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
