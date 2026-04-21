// Shared UI - Card Component
// Reusable card component

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-card p-6 shadow-sm ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={`mb-4 border-b border-border pb-4 ${className || ''}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: CardProps) {
  return <div className={className || ''}>{children}</div>
}

export function CardTitle({
  children,
  className,
}: CardProps & { as?: 'h1' | 'h2' | 'h3' }) {
  return (
    <h2 className={`text-xl font-bold ${className || ''}`}>
      {children}
    </h2>
  )
}
