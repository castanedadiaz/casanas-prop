import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import PropertyForm from '../components/admin/PropertyForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import api from '../services/api'

export default function AdminPropertyForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  const { data: property, isLoading } = useQuery({
    queryKey: ['adminPropertyDetail', id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}`)
      return res.data?.property || res.data || null
    },
    enabled: isEdit,
  })

  if (isEdit && isLoading) {
    return <LoadingSpinner fullScreen text="Cargando datos de la propiedad..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/propiedades"
          className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-primary transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            {isEdit ? 'Editar Propiedad' : 'Publicar Nueva Propiedad'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit
              ? 'Modificá las especificaciones o cambiá las fotografías.'
              : 'Completá los datos requeridos para publicar el inmueble.'}
          </p>
        </div>
      </div>

      <PropertyForm initialData={property} isEdit={isEdit} />
    </div>
  )
}

