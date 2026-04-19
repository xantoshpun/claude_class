import { Playground } from '@/components/playground/Playground'

export default function PlaygroundPage() {
  return (
    <div className="max-w-5xl mx-auto h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Interactive Playground</h1>
        <p className="text-muted-foreground mt-1">Try the Claude API directly in your browser</p>
      </div>
      <Playground />
    </div>
  )
}
