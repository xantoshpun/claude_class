'use client'

import { useState, useCallback } from 'react'
import { CheckCircle2, Circle, FileText, Bookmark, BookmarkCheck } from 'lucide-react'
import toast from 'react-hot-toast'

interface LessonActionsProps {
  moduleSlug: string
  lessonSlug: string
  isCompleted: boolean
  initialNote: string
}

export function LessonActions({ moduleSlug, lessonSlug, isCompleted, initialNote }: LessonActionsProps) {
  const [completed, setCompleted] = useState(isCompleted)
  const [showNotes, setShowNotes] = useState(false)
  const [note, setNote] = useState(initialNote)
  const [bookmarked, setBookmarked] = useState(false)
  const [saving, setSaving] = useState(false)

  async function markComplete() {
    if (completed) return
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleSlug, lessonSlug }),
      })
      const data = await res.json()
      setCompleted(true)
      toast.success('Lesson completed! +10 XP 🎉')
      if (data.newAchievements?.length) {
        for (const slug of data.newAchievements) {
          setTimeout(() => toast.success(`Achievement unlocked! 🏆`), 500)
        }
      }
    } catch {
      toast.error('Failed to save progress')
    }
  }

  const saveNote = useCallback(async (content: string) => {
    setSaving(true)
    try {
      await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleSlug, lessonSlug, content }),
      })
    } finally {
      setSaving(false)
    }
  }, [moduleSlug, lessonSlug])

  async function toggleBookmark() {
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleSlug, lessonSlug }),
    })
    const data = await res.json()
    setBookmarked(data.bookmarked)
    toast.success(data.bookmarked ? 'Bookmarked!' : 'Bookmark removed')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={markComplete}
          disabled={completed}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            completed
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          {completed ? 'Completed' : 'Mark as Complete'}
        </button>

        <button
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-accent transition-colors"
        >
          <FileText className="w-4 h-4" />
          {showNotes ? 'Hide Notes' : 'My Notes'}
        </button>

        <button
          onClick={toggleBookmark}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-accent transition-colors"
        >
          {bookmarked ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      {showNotes && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Notes for this lesson</h3>
            {saving && <span className="text-xs text-muted-foreground">Saving...</span>}
          </div>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value)
              const timeout = setTimeout(() => saveNote(e.target.value), 1000)
              return () => clearTimeout(timeout)
            }}
            placeholder="Write your notes here..."
            className="w-full h-32 bg-background border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}
    </div>
  )
}
