import { useEffect } from 'react'

export const SITE_URL = 'https://casanaspropiedades.com.ar'
export const SITE_NAME = 'Casañas Propiedades'
export const DEFAULT_TITLE = 'Casañas Propiedades | Inmobiliaria en el Partido de la Costa y Zona — Venta y Alquiler'
export const DEFAULT_DESCRIPTION =
  'Inmobiliaria en el Partido de la Costa y zona. Casas, departamentos, terrenos y locales en venta y alquiler. Tasaciones sin cargo, martillera colegiada y respaldo legal en cada operación.'
export const DEFAULT_IMAGE = `${SITE_URL}/logo.png`

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(data) {
  const id = 'page-jsonld'
  let el = document.getElementById(id)
  if (!data) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Actualiza title, description, canonical, Open Graph, Twitter y JSON-LD por página.
 * @param {object} opts
 * @param {string} [opts.title]       Título (se le agrega " | Casañas Propiedades")
 * @param {string} [opts.description]
 * @param {string} [opts.path]        Ruta canónica (ej. "/propiedades")
 * @param {string} [opts.image]       URL absoluta de la imagen para compartir
 * @param {boolean} [opts.noindex]    true para páginas que no deben indexarse
 * @param {object} [opts.jsonLd]      Datos estructurados schema.org de la página
 * @param {string} [opts.type]        og:type (website | article)
 */
export function useSeo({ title, description, path, image, noindex = false, jsonLd, type = 'website' } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
    const desc = (description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim().slice(0, 160)
    const url = `${SITE_URL}${path ?? window.location.pathname}`
    const img = image || DEFAULT_IMAGE

    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    setCanonical(url)

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('property', 'og:type', type)

    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', img)

    setJsonLd(jsonLd || null)
  }, [title, description, path, image, noindex, type, JSON.stringify(jsonLd || null)])
}
