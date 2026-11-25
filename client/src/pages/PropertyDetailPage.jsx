import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Bed,
  Bath,
  Maximize2,
  Car,
  Calendar,
  MapPin,
  Check,
  Share2,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getPropertyBySlug } from '../services/propertyService'
import ImageGallery from '../components/properties/ImageGallery'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import Badge from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import {
  formatPrice,
  getOperationLabel,
  getPropertyTypeLabel,
  getStatusLabel,
  getStatusColor,
} from '../utils/formatters'
import { useSeo, SITE_URL } from '../utils/seo'

const SCHEMA_TYPE = {
  HOUSE: 'SingleFamilyResidence',
  APARTMENT: 'Apartment',
  LAND: 'Place',
  COMMERCIAL: 'Place',
  OFFICE: 'Place',
}

function buildPropertySeo(property, slug) {
  if (!property) return { title: 'Propiedad', path: `/propiedad/${slug}` }
  const op = getOperationLabel(property.operationType)
  const type = getPropertyTypeLabel(property.propertyType)
  const zone = [property.neighborhood, property.city].filter(Boolean).join(', ')
  const price = formatPrice(property.price, property.currency)
  const cover = property.images?.find((i) => i.isCover) || property.images?.[0]
  const url = `${SITE_URL}/propiedad/${property.slug}`
  const features = [
    property.bedrooms ? `${property.bedrooms} dorm.` : null,
    property.bathrooms ? `${property.bathrooms} baños` : null,
    property.surfaceTotal ? `${property.surfaceTotal} m²` : null,
  ].filter(Boolean).join(' · ')

  return {
    title: `${property.title} — ${type} en ${op} en ${zone}`,
    description: `${type} en ${op.toLowerCase()} en ${zone}. ${price}. ${features}. ${property.description}`,
    path: `/propiedad/${property.slug}`,
    image: cover?.url,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'RealEstateListing',
          name: property.title,
          url,
          description: property.description,
          datePosted: property.createdAt,
          image: (property.images || []).map((i) => i.url),
          offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: property.currency,
            businessFunction: property.operationType === 'RENT'
              ? 'http://purl.org/goodrelations/v1#LeaseOut'
              : 'http://purl.org/goodrelations/v1#Sell',
            availability: property.status === 'AVAILABLE'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/SoldOut',
            seller: { '@id': `${SITE_URL}/#organization` },
          },
          about: {
            '@type': SCHEMA_TYPE[property.propertyType] || 'Place',
            name: property.title,
            address: {
              '@type': 'PostalAddress',
              streetAddress: property.address,
              addressLocality: property.city,
              addressRegion: 'Buenos Aires',
              addressCountry: 'AR',
            },
            ...(property.bedrooms ? { numberOfBedrooms: property.bedrooms } : {}),
            ...(property.bathrooms ? { numberOfBathroomsTotal: property.bathrooms } : {}),
            ...(property.surfaceTotal
              ? { floorSize: { '@type': 'QuantitativeValue', value: property.surfaceTotal, unitCode: 'MTK' } }
              : {}),
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Propiedades', item: `${SITE_URL}/propiedades` },
            { '@type': 'ListItem', position: 3, name: property.title, item: url },
          ],
        },
      ],
    },
  }
}

export default function PropertyDetailPage() {
  const { slug } = useParams()

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', slug],
    queryFn: () => getPropertyBySlug(slug),
  })

  useSeo(
    error || (!isLoading && !property)
      ? { title: 'Propiedad no encontrada', noindex: true }
      : buildPropertySeo(property, slug)
  )

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando detalles de la propiedad..." />
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-display text-3xl font-bold text-primary">Propiedad no encontrada</h2>
        <p className="text-gray-500">
          La propiedad que estás buscando no existe o fue retirada del catálogo.
        </p>
        <Link
          to="/propiedades"
          className="inline-flex items-center gap-2 text-secondary-dark font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Mirá esta propiedad en Casañas Propiedades: ${property.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Enlace copiado al portapapeles')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 sm:pb-8">
      {/* Breadcrumb & back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/propiedades"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Propiedades
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition font-medium p-2 rounded-lg hover:bg-white"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Compartir</span>
        </button>
      </div>

      {/* Main Image Gallery */}
      <ImageGallery images={property.images} title={property.title} />

      {/* Content Layout: 2 Cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Location Header */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={property.operationType === 'SALE' ? 'primary' : 'secondary'} size="lg">
                {getOperationLabel(property.operationType)}
              </Badge>
              <Badge variant="default" size="lg">
                {getPropertyTypeLabel(property.propertyType)}
              </Badge>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(property.status)}`}>
                {getStatusLabel(property.status)}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight">
              {property.title}
            </h1>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                [property.address, property.neighborhood, property.city, 'Buenos Aires, Argentina']
                  .filter(Boolean)
                  .join(', ')
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-wrap items-center gap-2 text-gray-600 hover:text-primary text-sm group transition"
            >
              <MapPin className="h-4 w-4 text-secondary shrink-0" />
              <span className="group-hover:underline">
                {property.address}, {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-secondary/20 group-hover:bg-secondary/35 px-2.5 py-0.5 rounded-full transition">
                Ver en mapa
                <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          </div>

          {/* Key Specs Grid */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-display text-lg font-bold text-primary border-b border-gray-100 pb-3">
              Características Principales
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary-dark">
                  <Maximize2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sup. Total</p>
                  <p className="text-sm font-bold text-gray-900">{property.surfaceTotal} m²</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary-dark">
                  <Maximize2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sup. Cubierta</p>
                  <p className="text-sm font-bold text-gray-900">{property.surfaceCovered} m²</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary-dark">
                  <Bed className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dormitorios</p>
                  <p className="text-sm font-bold text-gray-900">{property.bedrooms || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary-dark">
                  <Bath className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Baños</p>
                  <p className="text-sm font-bold text-gray-900">{property.bathrooms || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary-dark">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cocheras</p>
                  <p className="text-sm font-bold text-gray-900">{property.garages || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary-dark">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Antigüedad</p>
                  <p className="text-sm font-bold text-gray-900">
                    {property.age ? `${property.age} años` : 'A estrenar'}
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities badges */}
            {(property.hasPool || property.hasGarden || property.hasSecurity) && (
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                {property.hasPool && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Check className="h-3.5 w-3.5" /> Piscina
                  </span>
                )}
                {property.hasGarden && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Check className="h-3.5 w-3.5" /> Jardín
                  </span>
                )}
                {property.hasSecurity && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Check className="h-3.5 w-3.5" /> Seguridad 24hs
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-display text-lg font-bold text-primary border-b border-gray-100 pb-3">
              Descripción
            </h2>
            <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
              {property.description}
            </div>
          </div>
        </div>

        {/* Right Sticky Card (1/3) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Precio de Publicación
              </p>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-primary mt-1">
                {formatPrice(property.price, property.currency)}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-3">
              <p className="text-xs text-gray-500">
                ¿Querés coordinar una visita o tenés dudas? Escribinos de inmediato:
              </p>

              <WhatsAppButton
                propertyTitle={property.title}
                propertyId={property.id}
                text="Consultar por WhatsApp"
                className="w-full py-3.5 font-bold shadow-lg text-base"
              />
            </div>

            <div className="p-4 bg-cream rounded-xl border border-secondary/20 space-y-2 text-xs text-gray-600">
              <p className="font-semibold text-primary">CASAÑAS PROPIEDADES</p>
              <p>Atención directa por asesores inmobiliarios certificados.</p>
              <p className="text-[11px] text-gray-500">Ref ID: {property.id.slice(-8)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bar for Mobile Conversion */}
      <WhatsAppButton
        variant="sticky-bar"
        propertyTitle={property.title}
        propertyId={property.id}
      />
    </div>
  )
}

