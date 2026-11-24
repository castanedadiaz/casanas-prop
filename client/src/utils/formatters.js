import { WHATSAPP_NUMBER } from './constants'

export function formatPrice(price, currency = 'USD') {
  if (!price && price !== 0) return 'Consultar'
  const validCurrency = (currency && typeof currency === 'string' && currency.length === 3) ? currency.toUpperCase() : 'USD'
  try {
    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return formatter.format(price)
  } catch {
    return `${validCurrency} ${price}`
  }
}

export function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getWhatsAppLink(propertyTitle, propertyId) {
  if (propertyTitle) {
    const message = encodeURIComponent(
      `Hola, me interesa la propiedad ${propertyTitle} (ID: ${propertyId}) publicada en su web. ¿Podrían darme más información?`
    )
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  }
  return `https://wa.me/${WHATSAPP_NUMBER}`
}

export function getOperationLabel(type) {
  const map = { SALE: 'Venta', RENT: 'Alquiler' }
  return map[type] || type
}

export function getPropertyTypeLabel(type) {
  const map = { HOUSE: 'Casa', APARTMENT: 'Departamento', COMMERCIAL: 'Comercial', LAND: 'Terreno', OFFICE: 'Oficina' }
  return map[type] || type
}

export function getStatusLabel(status) {
  const map = { AVAILABLE: 'Disponible', RESERVED: 'Reservada', SOLD: 'Vendida', RENTED: 'Alquilada' }
  return map[status] || status
}

export function getStatusColor(status) {
  const map = {
    AVAILABLE: 'bg-green-100 text-green-800',
    RESERVED: 'bg-yellow-100 text-yellow-800',
    SOLD: 'bg-red-100 text-red-800',
    RENTED: 'bg-blue-100 text-blue-800',
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}
