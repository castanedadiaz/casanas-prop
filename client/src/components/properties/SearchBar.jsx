import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { OPERATION_TYPES, PROPERTY_TYPES } from '../../utils/constants'
import Button from '../ui/Button'

export default function SearchBar({ compact = false }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [operationType, setOperationType] = useState(searchParams.get('operationType') || '')
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (operationType) params.set('operationType', operationType)
    if (propertyType) params.set('propertyType', propertyType)
    if (city.trim()) params.set('city', city.trim())
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (search.trim()) params.set('search', search.trim())

    navigate(`/propiedades?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 transition-all ${
        compact ? 'p-4' : 'p-4 sm:p-6 lg:p-8'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Operación */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Operación
          </label>
          <select
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          >
            <option value="">Todas las operaciones</option>
            {OPERATION_TYPES.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de propiedad */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Tipo de Inmueble
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          >
            <option value="">Todos los tipos</option>
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ubicación / Ciudad */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Ubicación / Ciudad
          </label>
          <input
            type="text"
            placeholder="Ej: Palermo, San Isidro..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* Botón Buscar */}
        <div className="flex items-end">
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="w-full py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-transform active:scale-95"
          >
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </div>
      </div>
    </form>
  )
}

