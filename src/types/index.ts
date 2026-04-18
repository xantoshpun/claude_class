export * from './content'

export interface AchievementDef {
  slug: string
  name: string
  description: string
  icon: string
  xpReward: number
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
}

export interface UserProgress {
  [moduleSlug: string]: {
    [lessonSlug: string]: {
      completed: boolean
      completedAt?: string
    }
  }
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string | null
  image: string | null
  xp: number
  level: number
}
