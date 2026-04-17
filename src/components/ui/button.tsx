import * as React from 'react'
export function Button({ className = '', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${className}`} {...props}>{children}</button>
}
