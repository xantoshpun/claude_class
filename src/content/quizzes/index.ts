import { quiz as q1 } from './module-01-quiz'
import { quiz as q2 } from './module-02-quiz'
import { quiz as q3 } from './module-03-quiz'
import { quiz as q4 } from './module-04-quiz'
import { quiz as q5 } from './module-05-quiz'
import { quiz as q6 } from './module-06-quiz'
import { quiz as q7 } from './module-07-quiz'
import { quiz as q8 } from './module-08-quiz'
import type { Quiz } from '@/types/content'

const quizzes: Quiz[] = [q1, q2, q3, q4, q5, q6, q7, q8]

export function getQuiz(id: string): Quiz | undefined {
  return quizzes.find((q) => q.id === id)
}

export function getAllQuizzes(): Quiz[] {
  return quizzes
}
