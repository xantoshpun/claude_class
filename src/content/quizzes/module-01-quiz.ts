import type { Quiz } from '@/types/content'

export const quiz: Quiz = {
  id: 'module-01-quiz',
  moduleSlug: 'module-01-introduction',
  title: 'Introduction to Claude — Quiz',
  passingScore: 70,
  xpReward: 50,
  questions: [
    {
      id: 'q1',
      text: 'Which company created Claude?',
      options: [
        { id: 'a', text: 'OpenAI' },
        { id: 'b', text: 'Google DeepMind' },
        { id: 'c', text: 'Anthropic' },
        { id: 'd', text: 'Meta AI' },
      ],
      correctOption: 'c',
      explanation: 'Claude is built by Anthropic, an AI safety company founded in 2021.',
    },
    {
      id: 'q2',
      text: "What is Anthropic's core training approach that makes Claude safer?",
      options: [
        { id: 'a', text: 'Reinforcement Learning from Human Feedback (RLHF)' },
        { id: 'b', text: 'Constitutional AI (CAI)' },
        { id: 'c', text: 'Generative Adversarial Networks (GANs)' },
        { id: 'd', text: 'Transfer Learning' },
      ],
      correctOption: 'b',
      explanation: 'Constitutional AI teaches Claude to be helpful and harmless using a set of principles rather than relying solely on human feedback.',
    },
    {
      id: 'q3',
      text: 'What is the maximum context window Claude supports?',
      options: [
        { id: 'a', text: '8,000 tokens' },
        { id: 'b', text: '32,000 tokens' },
        { id: 'c', text: '100,000 tokens' },
        { id: 'd', text: '200,000 tokens' },
      ],
      correctOption: 'd',
      explanation: 'Claude supports up to 200,000 tokens of context, roughly 150,000 words.',
    },
    {
      id: 'q4',
      text: 'Which Claude model tier offers the best balance of speed and capability for production apps?',
      options: [
        { id: 'a', text: 'Haiku' },
        { id: 'b', text: 'Sonnet' },
        { id: 'c', text: 'Opus' },
        { id: 'd', text: 'Flash' },
      ],
      correctOption: 'b',
      explanation: 'Sonnet is the sweet spot — more capable than Haiku but faster and cheaper than Opus, making it ideal for production applications.',
    },
    {
      id: 'q5',
      text: 'Claude was named after which historical figure?',
      options: [
        { id: 'a', text: 'Claude Monet, the painter' },
        { id: 'b', text: 'Claude Shannon, father of information theory' },
        { id: 'c', text: 'Claude Debussy, the composer' },
        { id: 'd', text: 'Claude Lévi-Strauss, the anthropologist' },
      ],
      correctOption: 'b',
      explanation: 'Claude was named as a nod to Claude Shannon, the father of information theory.',
    },
    {
      id: 'q6',
      text: 'Which model tier is fastest and most cost-efficient?',
      options: [
        { id: 'a', text: 'Opus' },
        { id: 'b', text: 'Sonnet' },
        { id: 'c', text: 'Haiku' },
        { id: 'd', text: 'All models cost the same' },
      ],
      correctOption: 'c',
      explanation: 'Haiku is the fastest and most cost-efficient tier, ideal for high-volume or real-time applications.',
    },
    {
      id: 'q7',
      text: 'What are the three core design principles Claude is built around?',
      options: [
        { id: 'a', text: 'Fast, cheap, and scalable' },
        { id: 'b', text: 'Helpful, harmless, and honest' },
        { id: 'c', text: 'Creative, accurate, and multilingual' },
        { id: 'd', text: 'Safe, open, and reproducible' },
      ],
      correctOption: 'b',
      explanation: 'Claude is designed to be helpful, harmless, and honest — the three foundational principles of its design.',
    },
  ],
}
