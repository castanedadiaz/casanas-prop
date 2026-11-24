import React from 'react'
import clsx from 'clsx'

export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/15 text-secondary-dark border-secondary/30',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5',
  }

  return (
    <span className={clsx('inline-flex items-center rounded-full border', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}

