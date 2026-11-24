import api from './api'

export async function getProperties(params) {
  const response = await api.get('/properties', { params })
  return response.data
}

export async function getFeaturedProperties() {
  const response = await api.get('/properties/featured')
  return response.data?.properties || response.data || []
}

export async function getPropertyBySlug(slug) {
  const response = await api.get(`/properties/${slug}`)
  return response.data?.property || response.data
}

export async function createProperty(formData) {
  const response = await api.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function updateProperty(id, data) {
  const response = await api.put(`/properties/${id}`, data)
  return response.data
}

export async function updateStatus(id, data) {
  const response = await api.patch(`/properties/${id}/status`, data)
  return response.data
}

export async function deleteProperty(id, permanent = false) {
  const response = await api.delete(`/properties/${id}`, {
    params: { permanent },
  })
  return response.data
}

export async function addImages(id, formData) {
  const response = await api.post(`/properties/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function deleteImage(imageId) {
  const response = await api.delete(`/properties/images/${imageId}`)
  return response.data
}
