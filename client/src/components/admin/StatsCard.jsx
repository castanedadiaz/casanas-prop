import React from 'react'

export default function StatsCard({ title, value, icon: Icon, change, trend = 'up' }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="font-display text-3xl font-bold text-primary">{value}</p>
        {change && (
          <p
            className={`text-xs mt-1 font-medium ${
              trend === 'up' ? 'text-emerald-600' : 'text-gray-500'
            }`}
          >
            {change}
          </p>
        )}
      </div>
      <div className="h-12 w-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary-dark">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  )
}

