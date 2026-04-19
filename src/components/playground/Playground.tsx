'use client'

import { useState, useRef } from 'react'
import { Send, Trash2, Loader2 } from 'lucide-react'

const MODELS = [
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku (Fast)' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet (Balanced)' },
  { id: 'claude-opus-4-5', label: 'Claude Opus (Powerful)' },
]

const EXAMPLES = [
  { label: 'Explain a concept', prompt: 'Explain prompt engineering in 3 bullet points with examples.' },
  { label: 'Write code', prompt: 'Write a Python function that fetches weather data from an API with error handling.' },
  { label: 'Analyze text', prompt: 'What are the key themes in this quote: "The measure of intelligence is the ability to change." - Einstein' },
  { label: 'Creative writing', prompt: 'Write a haiku about artificial intelligence and human creativity.' },
]

export function Playground() {
  const [model, setModel] = useState(MODELS[0].id)
  const [system, setSystem] = useState('')
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [maxTokens, setMaxTokens] = useState(1024)
  const abortRef = useRef<AbortController | null>(null)

  async function send() {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setResponse('')

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          system: system || undefined,
          messages: [{ role: 'user', content: prompt }],
          maxTokens,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const err = await res.json()
        setResponse(`Error: ${err.error}`)
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let text = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setResponse(text)
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setResponse('Error: Failed to connect to the API.')
      }
    } finally {
      setLoading(false)
    }
  }

  function stop() {
    abortRef.current?.abort()
    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      {/* Input panel */}
      <div className="flex flex-col gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Max Tokens: {maxTokens}</label>
            <input
              type="range" min={64} max={2048} step={64} value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="mt-1 w-full accent-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System Prompt (optional)</label>
            <textarea
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              placeholder="You are a helpful assistant..."
              className="mt-1 w-full h-20 bg-background border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <p className="text-xs text-muted-foreground w-full">Try an example:</p>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setPrompt(ex.prompt)}
              className="text-xs px-3 py-1.5 bg-secondary rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Your Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send() }}
            placeholder="Ask Claude anything..."
            className="flex-1 bg-background border border-border rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={loading ? stop : send}
              disabled={!prompt.trim() && !loading}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                loading ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Stop</> : <><Send className="w-4 h-4" /> Send (⌘+Enter)</>}
            </button>
            <button onClick={() => { setPrompt(''); setResponse('') }} className="px-3 py-2.5 border border-border rounded-xl hover:bg-accent transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Output panel */}
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Response</label>
        <div className="flex-1 bg-zinc-950 rounded-xl p-4 overflow-y-auto font-mono text-sm text-zinc-100 whitespace-pre-wrap">
          {loading && !response && <span className="text-zinc-500 animate-pulse">Claude is thinking...</span>}
          {response || (!loading && <span className="text-zinc-600">Response will appear here...</span>)}
          {loading && <span className="animate-pulse">▋</span>}
        </div>
      </div>
    </div>
  )
}
