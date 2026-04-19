import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'
import { checkAndAwardAchievements } from '@/lib/achievements'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { model = 'claude-haiku-4-5-20251001', system, messages, maxTokens = 1024 } = await req.json()

  if (!messages?.length) return NextResponse.json({ error: 'messages required' }, { status: 400 })

  // Award playground achievement on first use
  await checkAndAwardAchievements(session.user.id, { playgroundUsed: true })

  const stream = client.messages.stream({
    model,
    max_tokens: Math.min(maxTokens, 2048),
    system: system || undefined,
    messages,
  })

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text))
          }
        }
      } catch (err) {
        controller.error(err)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
