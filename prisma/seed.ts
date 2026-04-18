import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const achievements = [
  { slug: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', xpReward: 20, rarity: 'COMMON' },
  { slug: 'first-quiz', name: 'Quiz Taker', description: 'Complete your first quiz', icon: '📝', xpReward: 30, rarity: 'COMMON' },
  { slug: 'perfect-quiz', name: 'Perfect Score', description: 'Get 100% on any quiz', icon: '⭐', xpReward: 75, rarity: 'UNCOMMON' },
  { slug: 'module-complete', name: 'Module Master', description: 'Complete an entire module', icon: '🏆', xpReward: 100, rarity: 'UNCOMMON' },
  { slug: 'all-complete', name: 'Claude Expert', description: 'Complete all 8 modules', icon: '🎓', xpReward: 500, rarity: 'LEGENDARY' },
  { slug: 'streak-3', name: 'On a Roll', description: 'Maintain a 3-day learning streak', icon: '🔥', xpReward: 30, rarity: 'COMMON' },
  { slug: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day learning streak', icon: '💪', xpReward: 75, rarity: 'UNCOMMON' },
  { slug: 'streak-30', name: 'Dedicated Learner', description: 'Maintain a 30-day learning streak', icon: '🚀', xpReward: 300, rarity: 'RARE' },
  { slug: 'first-playground', name: 'API Explorer', description: 'Send your first Playground request', icon: '🧪', xpReward: 40, rarity: 'COMMON' },
  { slug: 'first-note', name: 'Note Taker', description: 'Write your first lesson note', icon: '📓', xpReward: 20, rarity: 'COMMON' },
  { slug: 'bookmarker', name: 'Curator', description: 'Bookmark 10 lessons', icon: '🔖', xpReward: 50, rarity: 'UNCOMMON' },
  { slug: 'speed-learner', name: 'Speed Learner', description: 'Complete 5 lessons in one day', icon: '⚡', xpReward: 60, rarity: 'UNCOMMON' },
]

async function main() {
  console.log('Seeding achievements...')
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    })
  }
  console.log(`Seeded ${achievements.length} achievements.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
