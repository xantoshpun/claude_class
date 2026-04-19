'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const language = className?.replace('language-', '') ?? 'text'

  function copy() {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-zinc-800 dark:bg-zinc-900 rounded-t-lg px-4 py-2">
        <span className="text-xs text-zinc-400 font-mono">{language}</span>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-zinc-900 dark:bg-zinc-950 text-zinc-100 rounded-b-lg p-4 overflow-x-auto !mt-0 !rounded-t-none">
        <code className="text-sm font-mono">{children}</code>
      </pre>
    </div>
  )
}

export function LessonContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const isBlock = className?.startsWith('language-')
          if (isBlock) {
            return <CodeBlock className={className}>{String(children).replace(/\n$/, '')}</CodeBlock>
          }
          return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props}>{children}</code>
        },
        pre({ children }) {
          return <>{children}</>
        },
        blockquote({ children }) {
          return <blockquote className="border-l-4 border-primary/50 pl-4 py-2 my-4 bg-primary/5 rounded-r italic text-muted-foreground">{children}</blockquote>
        },
        table({ children }) {
          return <div className="overflow-x-auto my-4"><table className="w-full border-collapse text-sm">{children}</table></div>
        },
        th({ children }) {
          return <th className="border border-border px-3 py-2 bg-muted font-semibold text-left">{children}</th>
        },
        td({ children }) {
          return <td className="border border-border px-3 py-2">{children}</td>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
