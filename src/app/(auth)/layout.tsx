export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-2xl font-bold">Claude Academy</h1>
          <p className="text-muted-foreground text-sm mt-1">Learn everything about Claude AI</p>
        </div>
        {children}
      </div>
    </div>
  )
}
