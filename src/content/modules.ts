import type { ModuleMeta } from '@/types/content'

export const modules: ModuleMeta[] = [
  {
    slug: 'module-01-introduction',
    title: 'Introduction to Claude',
    description: 'Understand what Claude is, how it was built, and what makes it unique among AI models.',
    icon: '🤖',
    order: 1,
    estimatedMinutes: 30,
    difficulty: 'beginner',
    xpReward: 150,
    quizId: 'module-01-quiz',
    lessons: [
      { slug: '01-what-is-claude', title: 'What is Claude?', estimatedMinutes: 10, difficulty: 'beginner', description: 'An introduction to Claude and Anthropic.' },
      { slug: '02-claude-vs-others', title: 'Claude vs Other AI Models', estimatedMinutes: 10, difficulty: 'beginner', description: 'How Claude compares to GPT and other models.' },
      { slug: '03-model-families', title: 'Claude Model Families', estimatedMinutes: 10, difficulty: 'beginner', description: 'Opus, Sonnet, and Haiku explained.' },
    ],
  },
  {
    slug: 'module-02-capabilities',
    title: "Claude's Capabilities",
    description: 'Explore what Claude can do — writing, coding, analysis, vision, and more.',
    icon: '⚡',
    order: 2,
    estimatedMinutes: 40,
    difficulty: 'beginner',
    xpReward: 150,
    quizId: 'module-02-quiz',
    lessons: [
      { slug: '01-writing-editing', title: 'Writing & Editing', estimatedMinutes: 10, difficulty: 'beginner', description: 'Claude as a writing assistant.' },
      { slug: '02-coding', title: 'Coding with Claude', estimatedMinutes: 10, difficulty: 'beginner', description: 'Using Claude for software development.' },
      { slug: '03-analysis', title: 'Analysis & Research', estimatedMinutes: 10, difficulty: 'beginner', description: 'Claude for research and data analysis.' },
      { slug: '04-vision', title: 'Vision & Images', estimatedMinutes: 10, difficulty: 'beginner', description: "Claude's multimodal image understanding." },
    ],
  },
  {
    slug: 'module-03-api-basics',
    title: 'Claude API Basics',
    description: 'Get started with the Anthropic API — authentication, requests, and responses.',
    icon: '🔌',
    order: 3,
    estimatedMinutes: 45,
    difficulty: 'beginner',
    xpReward: 200,
    quizId: 'module-03-quiz',
    lessons: [
      { slug: '01-api-overview', title: 'API Overview', estimatedMinutes: 8, difficulty: 'beginner', description: 'What is the Anthropic API?' },
      { slug: '02-authentication', title: 'Authentication & Keys', estimatedMinutes: 8, difficulty: 'beginner', description: 'Setting up API keys securely.' },
      { slug: '03-messages-api', title: 'The Messages API', estimatedMinutes: 12, difficulty: 'beginner', description: 'Core API for sending messages to Claude.' },
      { slug: '04-python-sdk', title: 'Python SDK', estimatedMinutes: 10, difficulty: 'beginner', description: 'Using the official Python SDK.' },
      { slug: '05-typescript-sdk', title: 'TypeScript SDK', estimatedMinutes: 7, difficulty: 'beginner', description: 'Using the official TypeScript/Node.js SDK.' },
    ],
  },
  {
    slug: 'module-04-prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Master the art of writing effective prompts to get the best results from Claude.',
    icon: '✏️',
    order: 4,
    estimatedMinutes: 50,
    difficulty: 'intermediate',
    xpReward: 200,
    quizId: 'module-04-quiz',
    lessons: [
      { slug: '01-prompting-basics', title: 'Prompting Basics', estimatedMinutes: 10, difficulty: 'intermediate', description: 'Foundations of effective prompting.' },
      { slug: '02-system-prompts', title: 'System Prompts', estimatedMinutes: 10, difficulty: 'intermediate', description: 'Controlling Claude behavior with system prompts.' },
      { slug: '03-chain-of-thought', title: 'Chain of Thought', estimatedMinutes: 10, difficulty: 'intermediate', description: 'Getting Claude to reason step by step.' },
      { slug: '04-few-shot', title: 'Few-Shot Prompting', estimatedMinutes: 10, difficulty: 'intermediate', description: 'Teaching by example.' },
      { slug: '05-xml-structure', title: 'XML & Structured Prompts', estimatedMinutes: 10, difficulty: 'intermediate', description: 'Using XML tags for better control.' },
    ],
  },
  {
    slug: 'module-05-tool-use',
    title: 'Tool Use & Function Calling',
    description: 'Enable Claude to use external tools and APIs to complete complex tasks.',
    icon: '🔧',
    order: 5,
    estimatedMinutes: 45,
    difficulty: 'intermediate',
    xpReward: 250,
    quizId: 'module-05-quiz',
    lessons: [
      { slug: '01-tool-use-intro', title: 'Introduction to Tool Use', estimatedMinutes: 10, difficulty: 'intermediate', description: 'What is tool use and why it matters.' },
      { slug: '02-defining-tools', title: 'Defining Tools', estimatedMinutes: 12, difficulty: 'intermediate', description: 'Writing tool schemas Claude can understand.' },
      { slug: '03-tool-results', title: 'Handling Tool Results', estimatedMinutes: 10, difficulty: 'intermediate', description: 'Returning tool results back to Claude.' },
      { slug: '04-multi-tool', title: 'Multi-Tool Flows', estimatedMinutes: 13, difficulty: 'intermediate', description: 'Chaining multiple tools together.' },
    ],
  },
  {
    slug: 'module-06-advanced',
    title: 'Advanced Features',
    description: 'Explore streaming, extended thinking, the Files API, and prompt caching.',
    icon: '🚀',
    order: 6,
    estimatedMinutes: 45,
    difficulty: 'advanced',
    xpReward: 250,
    quizId: 'module-06-quiz',
    lessons: [
      { slug: '01-streaming', title: 'Streaming Responses', estimatedMinutes: 10, difficulty: 'advanced', description: 'Real-time streaming with Claude.' },
      { slug: '02-extended-thinking', title: 'Extended Thinking', estimatedMinutes: 12, difficulty: 'advanced', description: "Claude's deep reasoning mode." },
      { slug: '03-files-api', title: 'Files API', estimatedMinutes: 10, difficulty: 'advanced', description: 'Uploading and processing files with Claude.' },
      { slug: '04-prompt-caching', title: 'Prompt Caching', estimatedMinutes: 13, difficulty: 'advanced', description: 'Reduce latency and cost with caching.' },
    ],
  },
  {
    slug: 'module-07-production',
    title: 'Safety & Best Practices',
    description: 'Build responsible, cost-efficient, and production-ready Claude applications.',
    icon: '🛡️',
    order: 7,
    estimatedMinutes: 40,
    difficulty: 'advanced',
    xpReward: 200,
    quizId: 'module-07-quiz',
    lessons: [
      { slug: '01-safety-guidelines', title: 'Safety Guidelines', estimatedMinutes: 10, difficulty: 'advanced', description: "Anthropic's approach to AI safety." },
      { slug: '02-rate-limits', title: 'Rate Limits & Quotas', estimatedMinutes: 8, difficulty: 'advanced', description: 'Understanding and managing API limits.' },
      { slug: '03-cost-optimization', title: 'Cost Optimization', estimatedMinutes: 12, difficulty: 'advanced', description: 'Keeping API costs under control.' },
      { slug: '04-error-handling', title: 'Error Handling', estimatedMinutes: 10, difficulty: 'advanced', description: 'Building resilient applications.' },
    ],
  },
  {
    slug: 'module-08-building-apps',
    title: 'Building Apps with Claude',
    description: 'Design patterns, RAG systems, agents, and production deployment checklists.',
    icon: '🏗️',
    order: 8,
    estimatedMinutes: 50,
    difficulty: 'advanced',
    xpReward: 300,
    quizId: 'module-08-quiz',
    lessons: [
      { slug: '01-architecture-patterns', title: 'Architecture Patterns', estimatedMinutes: 12, difficulty: 'advanced', description: 'Common patterns for Claude-powered apps.' },
      { slug: '02-rag', title: 'RAG with Claude', estimatedMinutes: 13, difficulty: 'advanced', description: 'Retrieval-Augmented Generation explained.' },
      { slug: '03-agents', title: 'Building Agents', estimatedMinutes: 13, difficulty: 'advanced', description: 'Autonomous AI agents with Claude.' },
      { slug: '04-production-checklist', title: 'Production Checklist', estimatedMinutes: 12, difficulty: 'advanced', description: 'Ship your Claude app with confidence.' },
    ],
  },
]

export function getModule(slug: string): ModuleMeta | undefined {
  return modules.find((m) => m.slug === slug)
}

export function getLesson(moduleSlug: string, lessonSlug: string) {
  const mod = getModule(moduleSlug)
  if (!mod) return undefined
  return mod.lessons.find((l) => l.slug === lessonSlug)
}

export function getNextLesson(moduleSlug: string, lessonSlug: string) {
  const mod = getModule(moduleSlug)
  if (!mod) return null
  const idx = mod.lessons.findIndex((l) => l.slug === lessonSlug)
  if (idx === -1 || idx >= mod.lessons.length - 1) return null
  return { moduleSlug, lesson: mod.lessons[idx + 1] }
}

export function getPrevLesson(moduleSlug: string, lessonSlug: string) {
  const mod = getModule(moduleSlug)
  if (!mod) return null
  const idx = mod.lessons.findIndex((l) => l.slug === lessonSlug)
  if (idx <= 0) return null
  return { moduleSlug, lesson: mod.lessons[idx - 1] }
}

export function getTotalLessons(): number {
  return modules.reduce((sum, m) => sum + m.lessons.length, 0)
}
