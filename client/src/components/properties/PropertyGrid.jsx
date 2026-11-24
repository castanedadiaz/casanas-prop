import React from 'react'
import PropertyCard from './PropertyCard'
import { Home } from 'lucide-react'

export default function PropertyGrid({ properties = [], loading = false, emptyMessage = 'No se encontraron propiedades' }) {
  const items = Array.isArray(properties) ? properties : (properties?.properties || [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse space-y-4">
            <div className="h-52 bg-gray-200 rounded-xl w-full" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-100 rounded-lg w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-200 max-w-lg mx-auto my-8">
        <div className="h-14 w-14 rounded-full bg-secondary/15 flex items-center justify-center mx-auto text-secondary-dark mb-4">
          <Home className="h-7 w-7" />
        </div>
        <h3 className="font-display font-semibold text-lg text-primary mb-1">
          {emptyMessage}
        </h3>
        <p className="text-sm text-gray-500">
          Probá ajustando los filtros de búsqueda o volvé a revisar más tarde.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {items.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

