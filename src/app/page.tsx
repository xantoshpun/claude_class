import Link from 'next/link'
import { modules, getTotalLessons } from '@/content/modules'

export default function LandingPage() {
  const totalLessons = getTotalLessons()

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm">🎓</div>
            Claude Academy
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/register" className="text-sm px-4 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full font-medium mb-6">
          ✨ The complete Claude learning platform
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Master{' '}
          <span className="text-primary">Claude AI</span>
          <br />from zero to expert
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {totalLessons} lessons across 8 modules — from basic prompting to building production AI apps with the Anthropic API.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors">
            Start learning free
          </Link>
          <Link href="/login" className="px-8 py-3 border border-border rounded-xl font-semibold text-lg hover:bg-accent transition-colors">
            Sign in
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[['8', 'Modules'], [String(totalLessons), 'Lessons'], ['8', 'Quizzes']].map(([n, label]) => (
            <div key={label}>
              <div className="text-3xl font-bold text-primary">{n}</div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to learn Claude</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '📚', title: 'Structured Learning', desc: '8 modules with 30+ lessons, from beginner to advanced.' },
            { icon: '📝', title: 'Module Quizzes', desc: 'Test your knowledge after each module with focused quizzes.' },
            { icon: '🧪', title: 'Live Playground', desc: 'Try Claude API live in your browser — no setup needed.' },
            { icon: '📊', title: 'Progress Tracking', desc: 'Track every lesson completed. Pick up exactly where you left off.' },
            { icon: '🏆', title: 'Achievements & XP', desc: 'Earn badges and level up as you complete lessons and quizzes.' },
            { icon: '📓', title: 'Notes & Bookmarks', desc: 'Take notes on lessons and bookmark sections to revisit.' },
          ].map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="bg-muted/30 border-y border-border py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">8 modules, everything about Claude</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {modules.map((mod) => (
              <div key={mod.slug} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="text-3xl">{mod.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{mod.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{mod.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  mod.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  mod.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>{mod.difficulty}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to become a Claude expert?</h2>
        <p className="text-muted-foreground mb-8">Join learners mastering Claude AI — completely free.</p>
        <Link href="/register" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors inline-block">
          Create your free account
        </Link>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Claude Academy — built with Next.js and the Anthropic Claude API
      </footer>
    </div>
  )
}
