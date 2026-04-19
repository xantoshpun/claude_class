import type { Quiz } from '@/types/content'

export const quiz: Quiz = {
  id: 'module-03-quiz',
  moduleSlug: 'module-03-api-basics',
  title: 'Claude API Basics — Quiz',
  passingScore: 70,
  xpReward: 50,
  questions: [
    { id: 'q1', text: 'What is the primary endpoint for the Anthropic API?', options: [{ id: 'a', text: 'POST /v1/chat/completions' }, { id: 'b', text: 'POST /v1/messages' }, { id: 'c', text: 'GET /v1/generate' }, { id: 'd', text: 'POST /v1/completions' }], correctOption: 'b', explanation: 'The Anthropic Messages API uses POST /v1/messages as its primary endpoint.' },
    { id: 'q2', text: 'Where should your Anthropic API key be stored in a web application?', options: [{ id: 'a', text: 'In the browser localStorage' }, { id: 'b', text: 'Hardcoded in the frontend JavaScript' }, { id: 'c', text: 'In a server-side environment variable' }, { id: 'd', text: 'In the HTML meta tags' }], correctOption: 'c', explanation: 'API keys must be stored as server-side environment variables. Never expose them in client-side code.' },
    { id: 'q3', text: 'What does the stop_reason "max_tokens" indicate?', options: [{ id: 'a', text: 'Claude ran out of knowledge' }, { id: 'b', text: 'The response hit the max_tokens limit before completing naturally' }, { id: 'c', text: 'An error occurred' }, { id: 'd', text: 'The user\'s request was too long' }], correctOption: 'b', explanation: 'stop_reason "max_tokens" means Claude was cut off at the token limit — you may want to increase max_tokens or continue the conversation.' },
    { id: 'q4', text: 'Which Python method enables streaming responses?', options: [{ id: 'a', text: 'client.messages.create(stream=True)' }, { id: 'b', text: 'client.messages.stream()' }, { id: 'c', text: 'client.stream.messages()' }, { id: 'd', text: 'client.messages.async_create()' }], correctOption: 'b', explanation: 'client.messages.stream() is the correct method for streaming in the Python SDK, used as a context manager.' },
    { id: 'q5', text: 'What is a "system prompt" in the Messages API?', options: [{ id: 'a', text: 'A message from the user' }, { id: 'b', text: 'Claude\'s internal monologue' }, { id: 'c', text: 'An instruction that sets Claude\'s behavior before the conversation starts' }, { id: 'd', text: 'The API authentication header' }], correctOption: 'c', explanation: 'A system prompt is an instruction passed in the "system" parameter that configures Claude\'s behavior for the entire conversation.' },
    { id: 'q6', text: 'Which field tracks the token usage in an API response?', options: [{ id: 'a', text: 'response.tokens' }, { id: 'b', text: 'response.usage' }, { id: 'c', text: 'response.cost' }, { id: 'd', text: 'response.metadata' }], correctOption: 'b', explanation: 'The response.usage object contains input_tokens and output_tokens counts.' },
    { id: 'q7', text: 'In multi-turn conversations, what must messages alternate between?', options: [{ id: 'a', text: 'system and user roles' }, { id: 'b', text: 'user and assistant roles' }, { id: 'c', text: 'user and model roles' }, { id: 'd', text: 'human and AI roles' }], correctOption: 'b', explanation: 'Multi-turn conversations alternate between "user" and "assistant" roles in the messages array.' },
  ],
}
