import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Building2, PlusCircle, Eye, EyeOff, Sparkles, TrendingUp } from 'lucide-react'
import { getProperties } from '../services/propertyService'
import StatsCard from '../components/admin/StatsCard'
import Button from '../components/ui/Button'
import { formatPrice, getOperationLabel, getStatusLabel, getStatusColor } from '../utils/formatters'

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboardProperties'],
    queryFn: () => getProperties({ limit: 100 }),
  })

  const properties = data?.properties || []

  const total = properties.length
  const activeCount = properties.filter((p) => p.isVisible).length
  const featuredCount = properties.filter((p) => p.isFeatured).length
  const reservedCount = properties.filter((p) => p.status === 'RESERVED' || p.status === 'SOLD').length

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            Panel de Control
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Resumen general del catálogo y accesos directos de gestión.
          </p>
        </div>
        <Link to="/admin/propiedades/nueva">
          <Button variant="primary" size="md">
            <PlusCircle className="h-4 w-4" />
            Nueva Propiedad
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Propiedades"
          value={isLoading ? '...' : total}
          icon={Building2}
          change="En catálogo"
        />
        <StatsCard
          title="Publicadas Activas"
          value={isLoading ? '...' : activeCount}
          icon={Eye}
          change="Visibles en la web"
        />
        <StatsCard
          title="Destacadas"
          value={isLoading ? '...' : featuredCount}
          icon={Sparkles}
          change="En portada principal"
        />
        <StatsCard
          title="Reservadas / Vendidas"
          value={isLoading ? '...' : reservedCount}
          icon={TrendingUp}
          change="Operaciones cerradas"
        />
      </div>

      {/* Recent Properties Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-primary">
            Últimas Propiedades Registradas
          </h2>
          <Link
            to="/admin/propiedades"
            className="text-xs font-semibold text-secondary-dark hover:underline"
          >
            Ver todas →
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Cargando propiedades...</div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Aún no hay propiedades cargadas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Propiedad</th>
                  <th className="px-6 py-3">Operación</th>
                  <th className="px-6 py-3">Precio</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Visibilidad</th>
                  <th className="px-6 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.slice(0, 5).map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <div className="max-w-xs truncate">{property.title}</div>
                      <span className="text-xs font-normal text-gray-400">{property.city}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium">
                        {getOperationLabel(property.operationType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {formatPrice(property.price, property.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(property.status)}`}>
                        {getStatusLabel(property.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {property.isVisible ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                          <Eye className="h-3.5 w-3.5" /> Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                          <EyeOff className="h-3.5 w-3.5" /> Oculta
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/propiedades/editar/${property.id}`}
                        className="text-xs font-semibold text-primary hover:text-secondary-dark transition"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

