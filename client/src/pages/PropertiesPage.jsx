import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { getProperties } from '../services/propertyService'
import PropertyGrid from '../components/properties/PropertyGrid'
import SearchBar from '../components/properties/SearchBar'
import { SORT_OPTIONS } from '../utils/constants'
import { useSeo } from '../utils/seo'

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const hasFilters = [...searchParams.keys()].length > 0
  useSeo({
    title: 'Propiedades en venta y alquiler en Mar del Plata',
    description:
      'Catálogo de casas, departamentos, terrenos y locales en venta y alquiler en Mar del Plata. Filtrá por tipo, zona y precio y consultá directo por WhatsApp.',
    path: '/propiedades',
    // Las combinaciones de filtros no se indexan (evita contenido duplicado)
    noindex: hasFilters,
  })

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const operationType = searchParams.get('operationType') || ''
  const propertyType = searchParams.get('propertyType') || ''
  const city = searchParams.get('city') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sortBy = searchParams.get('sortBy') || 'newest'
  const search = searchParams.get('search') || ''

  const queryParams = {
    page: currentPage,
    limit: 12,
    ...(operationType && { operationType }),
    ...(propertyType && { propertyType }),
    ...(city && { city }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(sortBy && { sortBy }),
    ...(search && { search }),
  }

  const { data, isLoading } = useQuery({
    queryKey: ['properties', queryParams],
    queryFn: () => getProperties(queryParams),
  })

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sortBy', e.target.value)
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage.toString())
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const properties = data?.properties || []
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary">
          Catálogo de Propiedades
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Encontrá la opción perfecta entre todas nuestras propiedades disponibles.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <SearchBar compact />

      {/* Results meta and Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <p className="text-sm text-gray-600 font-medium">
          {isLoading ? (
            'Buscando propiedades...'
          ) : (
            <>
              Mostrando <span className="font-bold text-primary">{properties.length}</span> de{' '}
              <span className="font-bold text-primary">{pagination.total}</span> propiedades
            </>
          )}
        </p>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Ordenar por:
          </label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="text-xs font-medium border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Grid */}
      <PropertyGrid properties={properties} loading={isLoading} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`h-10 w-10 rounded-lg text-sm font-semibold transition ${
                pagination.page === pageNum
                  ? 'bg-primary text-white shadow'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

