import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

const rarityColors: Record<string, string> = {
  COMMON: 'border-zinc-300 dark:border-zinc-600',
  UNCOMMON: 'border-green-400 dark:border-green-600',
  RARE: 'border-blue-400 dark:border-blue-600',
  EPIC: 'border-purple-400 dark:border-purple-600',
  LEGENDARY: 'border-amber-400 dark:border-amber-600',
}

const rarityBg: Record<string, string> = {
  COMMON: 'bg-zinc-50 dark:bg-zinc-800/50',
  UNCOMMON: 'bg-green-50 dark:bg-green-900/20',
  RARE: 'bg-blue-50 dark:bg-blue-900/20',
  EPIC: 'bg-purple-50 dark:bg-purple-900/20',
  LEGENDARY: 'bg-amber-50 dark:bg-amber-900/20',
}

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions)
  const userId = session!.user!.id!

  const [all, earned] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { xpReward: 'desc' } }),
    prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true } }),
  ])

  const earnedMap = new Map(earned.map((ua) => [ua.achievement.slug, ua.earnedAt]))

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-muted-foreground mt-1">{earned.length} of {all.length} badges earned</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {all.map((ach) => {
          const earnedAt = earnedMap.get(ach.slug)
          const isEarned = !!earnedAt

          return (
            <div
              key={ach.slug}
              className={`border-2 rounded-xl p-4 transition-all ${
                isEarned ? rarityColors[ach.rarity] : 'border-border'
              } ${isEarned ? rarityBg[ach.rarity] : 'bg-card opacity-60'}`}
            >
              <div className={`text-4xl mb-3 ${!isEarned && 'grayscale opacity-40'}`}>{ach.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{ach.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{ach.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">+{ach.xpReward} XP</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  ach.rarity === 'LEGENDARY' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  ach.rarity === 'EPIC' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                  ach.rarity === 'RARE' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  ach.rarity === 'UNCOMMON' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  {ach.rarity.toLowerCase()}
                </span>
              </div>
              {isEarned && earnedAt && (
                <p className="text-xs text-muted-foreground mt-2">Earned {formatDate(earnedAt)}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
