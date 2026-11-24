import React from 'react'
import clsx from 'clsx'

export default function Input({
  label,
  error,
  type = 'text',
  icon: Icon,
  className = '',
  id,
  options = [],
  ...props
}) {
  const inputId = id || props.name || Math.random().toString(36).substring(7)
  const baseInputStyles = 'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-colors disabled:bg-gray-50 disabled:text-gray-500'

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Icon className="h-4 w-4" />
          </div>
        )}

        {type === 'select' ? (
          <select
            id={inputId}
            className={clsx(baseInputStyles, Icon && 'pl-9', error && 'border-red-500 focus:border-red-500 focus:ring-red-200')}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? opt}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={inputId}
            rows={4}
            className={clsx(baseInputStyles, error && 'border-red-500 focus:border-red-500 focus:ring-red-200')}
            {...props}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            className={clsx(baseInputStyles, Icon && 'pl-9', error && 'border-red-500 focus:border-red-500 focus:ring-red-200')}
            {...props}
          />
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

