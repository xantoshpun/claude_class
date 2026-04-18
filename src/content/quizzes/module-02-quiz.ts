import type { Quiz } from '@/types/content'

export const quiz: Quiz = {
  id: 'module-02-quiz',
  moduleSlug: 'module-02-capabilities',
  title: "Claude's Capabilities — Quiz",
  passingScore: 70,
  xpReward: 50,
  questions: [
    { id: 'q1', text: 'Which image formats does Claude support for vision tasks?', options: [{ id: 'a', text: 'JPEG, PNG, GIF, WebP' }, { id: 'b', text: 'JPEG and PNG only' }, { id: 'c', text: 'SVG, JPEG, PNG, TIFF' }, { id: 'd', text: 'All image formats' }], correctOption: 'a', explanation: 'Claude supports JPEG, PNG, GIF (static), and WebP formats for image inputs.' },
    { id: 'q2', text: 'Can Claude generate or edit images?', options: [{ id: 'a', text: 'Yes, it can generate images' }, { id: 'b', text: 'Yes, but only simple edits' }, { id: 'c', text: 'No, Claude only reads and understands images' }, { id: 'd', text: 'Only with special plugins' }], correctOption: 'c', explanation: 'Claude is a language model — it can understand and describe images but cannot generate or edit them.' },
    { id: 'q3', text: 'What is the best approach when asking Claude to improve your writing?', options: [{ id: 'a', text: 'Just paste the text with no instructions' }, { id: 'b', text: 'Specify the tone, audience, and what kind of improvement you want' }, { id: 'c', text: 'Ask Claude to rewrite everything from scratch' }, { id: 'd', text: 'Use a single word like "improve"' }], correctOption: 'b', explanation: 'Specificity is key — telling Claude the desired tone, audience, and type of improvement yields much better results.' },
    { id: 'q4', text: 'Which of these is NOT a coding task Claude handles well?', options: [{ id: 'a', text: 'Debugging error messages' }, { id: 'b', text: 'Compiling and running code directly' }, { id: 'c', text: 'Writing functions from descriptions' }, { id: 'd', text: 'Explaining legacy code' }], correctOption: 'b', explanation: 'Claude cannot compile or execute code — it generates code text. You run the code in your own environment.' },
    { id: 'q5', text: 'What is the advantage of Claude\'s 200K context window for analysis tasks?', options: [{ id: 'a', text: 'It makes responses faster' }, { id: 'b', text: 'Entire large documents can be analyzed in one request' }, { id: 'c', text: 'It reduces API costs' }, { id: 'd', text: 'It enables image generation' }], correctOption: 'b', explanation: 'The 200K token context window means entire books, codebases, or large documents can be analyzed in a single API call.' },
    { id: 'q6', text: 'Which tool could you use to convert a photo of a whiteboard into structured notes?', options: [{ id: 'a', text: 'Claude\'s code generation' }, { id: 'b', text: 'Claude\'s vision + OCR capability' }, { id: 'c', text: 'Claude\'s document summarization' }, { id: 'd', text: 'Claude\'s RAG system' }], correctOption: 'b', explanation: 'Claude\'s vision capability can read text from images (OCR) and convert whiteboard photos into structured, readable notes.' },
  ],
}
