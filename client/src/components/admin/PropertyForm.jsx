import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  OPERATION_TYPES,
  PROPERTY_TYPES,
  STATUS_OPTIONS,
  CURRENCIES,
  CITIES,
} from '../../utils/constants'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ImageUploader from './ImageUploader'
import { createProperty, updateProperty, deleteImage, addImages } from '../../services/propertyService'

export default function PropertyForm({ initialData = null, isEdit = false }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const [existingImages, setExistingImages] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    operationType: 'SALE',
    propertyType: 'HOUSE',
    price: '',
    currency: 'USD',
    address: '',
    city: 'Capital Federal',
    neighborhood: '',
    surfaceTotal: '',
    surfaceCovered: '',
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    age: 0,
    hasPool: false,
    hasGarden: false,
    hasSecurity: false,
    status: 'AVAILABLE',
    isFeatured: false,
    isVisible: true,
  })

  // Sincronizar datos iniciales cuando cargan en modo edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        operationType: initialData.operationType || 'SALE',
        propertyType: initialData.propertyType || 'HOUSE',
        price: initialData.price ?? '',
        currency: initialData.currency || 'USD',
        address: initialData.address || '',
        city: initialData.city || 'Capital Federal',
        neighborhood: initialData.neighborhood || '',
        surfaceTotal: initialData.surfaceTotal ?? '',
        surfaceCovered: initialData.surfaceCovered ?? '',
        bedrooms: initialData.bedrooms ?? 0,
        bathrooms: initialData.bathrooms ?? 0,
        garages: initialData.garages ?? 0,
        age: initialData.age ?? 0,
        hasPool: Boolean(initialData.hasPool),
        hasGarden: Boolean(initialData.hasGarden),
        hasSecurity: Boolean(initialData.hasSecurity),
        status: initialData.status || 'AVAILABLE',
        isFeatured: Boolean(initialData.isFeatured),
        isVisible: initialData.isVisible !== undefined ? Boolean(initialData.isVisible) : true,
      })
      setExistingImages(initialData.images || [])
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleDeleteExistingImage = async (imageId) => {
    if (!window.confirm('¿Seguro que querés eliminar esta foto?')) return
    try {
      await deleteImage(imageId)
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
      toast.success('Foto eliminada')
    } catch {
      toast.error('Error al eliminar la foto')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Formatear payload convirtiendo tipos numéricos y booleanos de forma limpia
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      operationType: formData.operationType,
      propertyType: formData.propertyType,
      price: Number(formData.price),
      currency: formData.currency,
      address: formData.address.trim(),
      city: formData.city.trim(),
      neighborhood: formData.neighborhood ? formData.neighborhood.trim() : null,
      surfaceTotal: Number(formData.surfaceTotal),
      surfaceCovered: Number(formData.surfaceCovered),
      bedrooms: Number(formData.bedrooms || 0),
      bathrooms: Number(formData.bathrooms || 0),
      garages: Number(formData.garages || 0),
      age: Number(formData.age || 0),
      hasPool: Boolean(formData.hasPool),
      hasGarden: Boolean(formData.hasGarden),
      hasSecurity: Boolean(formData.hasSecurity),
      status: formData.status,
      isFeatured: Boolean(formData.isFeatured),
      isVisible: Boolean(formData.isVisible),
    }

    try {
      if (isEdit) {
        await updateProperty(initialData.id, payload)

        // Si se seleccionaron nuevas fotos durante la edición
        if (files.length > 0) {
          const imageFormData = new FormData()
          files.forEach((file) => imageFormData.append('images', file))
          await addImages(initialData.id, imageFormData)
        }

        toast.success('Propiedad actualizada con éxito')
        navigate('/admin/propiedades')
      } else {
        const data = new FormData()
        Object.keys(payload).forEach((key) => {
          if (payload[key] !== null && payload[key] !== undefined) {
            data.append(key, payload[key])
          }
        })
        files.forEach((file) => {
          data.append('images', file)
        })

        await createProperty(data)
        toast.success('Propiedad publicada con éxito')
        navigate('/admin/propiedades')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Error al guardar la propiedad'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Información General */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <h3 className="font-display text-lg font-bold text-primary border-b border-gray-100 pb-3">
          1. Información Principal
        </h3>

        <div className="space-y-4">
          <Input
            label="Título de la propiedad *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Espectacular Casa con Jardín y Piscina en San Isidro"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tipo de Operación *"
              name="operationType"
              type="select"
              value={formData.operationType}
              onChange={handleChange}
              options={OPERATION_TYPES}
              required
            />

            <Input
              label="Tipo de Inmueble *"
              name="propertyType"
              type="select"
              value={formData.propertyType}
              onChange={handleChange}
              options={PROPERTY_TYPES}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Descripción detallada *
            </label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describí los detalles de la propiedad, luminosidad, acabados, entorno..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
        </div>
      </div>

      {/* 2. Precio y Ubicación */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <h3 className="font-display text-lg font-bold text-primary border-b border-gray-100 pb-3">
          2. Precio y Ubicación
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Precio *"
              name="price"
              type="number"
              min="0"
              step="any"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ej: 250000"
              required
            />
          </div>

          <Input
            label="Moneda"
            name="currency"
            type="select"
            value={formData.currency}
            onChange={handleChange}
            options={CURRENCIES}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Dirección *"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej: Av. del Libertador 2450"
              required
            />
          </div>

          <Input
            label="Ciudad / Localidad *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ej: Capital Federal"
            required
          />
        </div>

        <Input
          label="Barrio (opcional)"
          name="neighborhood"
          value={formData.neighborhood}
          onChange={handleChange}
          placeholder="Ej: Belgrano Chico"
        />
      </div>

      {/* 3. Características y Superficies */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <h3 className="font-display text-lg font-bold text-primary border-b border-gray-100 pb-3">
          3. Superficies y Ambientes
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Input
            label="Superficie Total (m²) *"
            name="surfaceTotal"
            type="number"
            min="0"
            value={formData.surfaceTotal}
            onChange={handleChange}
            required
          />

          <Input
            label="Superficie Cubierta (m²) *"
            name="surfaceCovered"
            type="number"
            min="0"
            value={formData.surfaceCovered}
            onChange={handleChange}
            required
          />

          <Input
            label="Dormitorios"
            name="bedrooms"
            type="number"
            min="0"
            value={formData.bedrooms}
            onChange={handleChange}
          />

          <Input
            label="Baños"
            name="bathrooms"
            type="number"
            min="0"
            value={formData.bathrooms}
            onChange={handleChange}
          />

          <Input
            label="Cocheras"
            name="garages"
            type="number"
            min="0"
            value={formData.garages}
            onChange={handleChange}
          />

          <Input
            label="Antigüedad (años)"
            name="age"
            type="number"
            min="0"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        {/* Amenities */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comodidades</label>
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasPool"
                checked={formData.hasPool}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span className="text-sm text-gray-700">Piscina</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasGarden"
                checked={formData.hasGarden}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span className="text-sm text-gray-700">Jardín</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasSecurity"
                checked={formData.hasSecurity}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span className="text-sm text-gray-700">Seguridad 24hs</span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Estado y Visibilidad */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <h3 className="font-display text-lg font-bold text-primary border-b border-gray-100 pb-3">
          4. Estado y Publicación
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <Input
            label="Estado"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleChange}
            options={STATUS_OPTIONS}
          />

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="rounded border-gray-300 text-secondary focus:ring-secondary h-4 w-4"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Propiedad Destacada ⭐
            </label>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isVisible"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor="isVisible" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Visible en la web pública
            </label>
          </div>
        </div>
      </div>

      {/* 5. Imágenes */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-display text-lg font-bold text-primary border-b border-gray-100 pb-3">
          5. Fotografías
        </h3>
        <ImageUploader
          files={files}
          setFiles={setFiles}
          existingImages={existingImages}
          onDeleteExisting={handleDeleteExistingImage}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate('/admin/propiedades')}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="px-8 shadow-lg"
        >
          {isEdit ? 'Guardar Cambios' : 'Publicar Propiedad'}
        </Button>
      </div>
    </form>
  )
}

