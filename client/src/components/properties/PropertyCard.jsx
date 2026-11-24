import React from 'react'
import { Link } from 'react-router-dom'
import { Bed, Bath, Maximize2, MapPin, Sparkles } from 'lucide-react'
import { formatPrice, getOperationLabel, getPropertyTypeLabel, getStatusLabel, getStatusColor } from '../../utils/formatters'
import Badge from '../ui/Badge'
import WhatsAppButton from '../ui/WhatsAppButton'

export default function PropertyCard({ property }) {
  if (!property) return null

  const coverImage = property.images?.find((img) => img.isCover)?.url || property.images?.[0]?.url
  const fullImageUrl = coverImage ? (coverImage.startsWith('http') ? coverImage : `http://localhost:3001${coverImage}`) : null

  return (
    <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <Link to={`/propiedad/${property.slug}`} className="relative block h-56 w-full overflow-hidden bg-gray-100">
        {fullImageUrl ? (
          <img
            src={fullImageUrl}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/20 text-gray-400 p-4 text-center">
            <span className="font-display font-semibold text-primary/60 text-lg">CASAÑAS</span>
            <span className="text-xs text-gray-500 mt-1">Imágenes disponibles pronto</span>
          </div>
        )}

        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge
            variant={property.operationType === 'SALE' ? 'primary' : 'secondary'}
            size="md"
            className="backdrop-blur-md bg-opacity-90 font-bold"
          >
            {getOperationLabel(property.operationType)}
          </Badge>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${getStatusColor(property.status)}`}>
            {getStatusLabel(property.status)}
          </span>
        </div>

        {property.isFeatured && (
          <div className="absolute top-3 right-3 z-10 bg-secondary text-primary text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="h-3 w-3 fill-current" />
            Destacada
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Property Type & Location */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-semibold text-secondary-dark uppercase tracking-wide">
              {getPropertyTypeLabel(property.propertyType)}
            </span>
            <div className="flex items-center gap-1 text-gray-500 truncate max-w-[150px]">
              <MapPin className="h-3 w-3 shrink-0 text-secondary" />
              <span className="truncate">{property.city}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/propiedad/${property.slug}`}>
            <h3 className="font-display font-bold text-base text-gray-900 group-hover:text-primary transition line-clamp-1 mb-2">
              {property.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="mb-4">
            <span className="text-xl font-extrabold text-primary">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 text-xs text-gray-600 mb-4">
            <div className="flex items-center gap-1.5" title="Dormitorios">
              <Bed className="h-4 w-4 text-secondary-dark shrink-0" />
              <span>{property.bedrooms || 0} dorm</span>
            </div>
            <div className="flex items-center gap-1.5" title="Baños">
              <Bath className="h-4 w-4 text-secondary-dark shrink-0" />
              <span>{property.bathrooms || 0} baños</span>
            </div>
            <div className="flex items-center gap-1.5" title="Superficie total">
              <Maximize2 className="h-4 w-4 text-secondary-dark shrink-0" />
              <span>{property.surfaceTotal || 0} m²</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex items-center justify-between gap-2">
          <Link
            to={`/propiedad/${property.slug}`}
            className="text-xs font-semibold text-primary hover:text-secondary-dark transition underline-offset-4 hover:underline"
          >
            Ver detalle →
          </Link>
          <WhatsAppButton
            propertyTitle={property.title}
            propertyId={property.id}
            text="Consultar"
            className="text-xs py-1.5 px-3"
          />
        </div>
      </div>
    </article>
  )
}

