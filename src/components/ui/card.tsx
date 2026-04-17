import * as React from 'react'
export function Card({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-xl border border-border bg-card ${className}`} {...props}>{children}</div>
}
