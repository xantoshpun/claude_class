export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface LessonMeta {
  slug: string
  title: string
  description?: string
  estimatedMinutes: number
  difficulty: Difficulty
  tags?: string[]
}

export interface ModuleMeta {
  slug: string
  title: string
  description: string
  icon: string
  order: number
  estimatedMinutes: number
  difficulty: Difficulty
  xpReward: number
  lessons: LessonMeta[]
  quizId: string
}

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  text: string
  options: QuizOption[]
  correctOption: string
  explanation: string
}

export interface Quiz {
  id: string
  moduleSlug: string
  title: string
  passingScore: number
  xpReward: number
  questions: QuizQuestion[]
}
