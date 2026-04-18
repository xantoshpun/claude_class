'use client'

import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { Sun, Moon, LogOut, User, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface TopbarProps {
  xp?: number
  level?: number
  streak?: number
}

export function Topbar({ xp = 0, level = 1, streak = 0 }: TopbarProps) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 flex-shrink-0">
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {streak > 0 && (
          <div className="flex items-center gap-1 text-sm font-medium text-orange-500">
            <span>🔥</span>
            <span>{streak}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">
          <span>Lv {level}</span>
          <span className="text-primary/60">·</span>
          <span>{xp} XP</span>
        </div>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium truncate">{session?.user?.name ?? 'Learner'}</p>
                <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
