import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getLevelFromXP(xp: number): number {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000]
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) return i + 1
  }
  return 1
}

export function getXPForNextLevel(level: number): number {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000]
  return thresholds[level] ?? thresholds[thresholds.length - 1]
}

export function getXPForCurrentLevel(level: number): number {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000]
  return thresholds[level - 1] ?? 0
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0]
}
