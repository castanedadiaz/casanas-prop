import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusCircle, Pencil, Trash2, Eye, EyeOff, Sparkles, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { getProperties, deleteProperty, updateStatus } from '../services/propertyService'
import Button from '../components/ui/Button'
import { formatPrice, getOperationLabel, getStatusLabel, getStatusColor } from '../utils/formatters'

export default function AdminPropertiesPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['adminAllProperties'],
    queryFn: () => getProperties({ limit: 100 }),
  })

  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }) => updateStatus(id, { isVisible }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminAllProperties'])
      queryClient.invalidateQueries(['adminDashboardProperties'])
      toast.success('Visibilidad actualizada')
    },
    onError: () => toast.error('Error al actualizar visibilidad'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProperty(id, false),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminAllProperties'])
      queryClient.invalidateQueries(['adminDashboardProperties'])
      toast.success('Propiedad dada de baja')
    },
    onError: () => toast.error('Error al dar de baja la propiedad'),
  })

  const handleDelete = (id, title) => {
    if (window.confirm(`¿Seguro que querés dar de baja "${title}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const properties = data?.properties || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            Gestión de Propiedades
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Listado completo con opciones de edición, estado y publicación.
          </p>
        </div>
        <Link to="/admin/propiedades/nueva">
          <Button variant="primary" size="md">
            <PlusCircle className="h-4 w-4" />
            Nueva Propiedad
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-400">Cargando catálogo...</div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            No hay propiedades registradas aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Inmueble</th>
                  <th className="px-6 py-4">Operación</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Visibilidad</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 max-w-sm truncate flex items-center gap-2">
                        {property.title}
                        {property.isFeatured && (
                          <span title="Destacada">
                            <Sparkles className="h-3.5 w-3.5 text-secondary shrink-0 fill-current" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {property.address}, {property.city}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-xs">
                      {getOperationLabel(property.operationType)}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary whitespace-nowrap">
                      {formatPrice(property.price, property.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(property.status)}`}>
                        {getStatusLabel(property.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          toggleVisibilityMutation.mutate({
                            id: property.id,
                            isVisible: !property.isVisible,
                          })
                        }
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition ${
                          property.isVisible
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title="Clic para cambiar visibilidad"
                      >
                        {property.isVisible ? (
                          <>
                            <Eye className="h-3.5 w-3.5" /> Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" /> Oculta
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/propiedad/${property.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-primary transition rounded-lg hover:bg-gray-100"
                          title="Ver en web pública"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/propiedades/editar/${property.id}`}
                          className="p-1.5 text-primary hover:text-secondary-dark transition rounded-lg hover:bg-gray-100"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id, property.title)}
                          className="p-1.5 text-red-500 hover:text-red-700 transition rounded-lg hover:bg-red-50"
                          title="Dar de baja"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

