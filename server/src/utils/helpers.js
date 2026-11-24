/**
 * Utilidades compartidas
 */
const slugify = require('slugify');

/**
 * Genera un slug URL-friendly a partir de un título.
 * Agrega un sufijo aleatorio de 4 caracteres para evitar colisiones.
 * @param {string} title - Título de la propiedad
 * @returns {string} Slug generado
 */
function generateSlug(title) {
  const base = slugify(title, { lower: true, strict: true });
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

/**
 * Construye el objeto `where` de Prisma a partir de los query params validados.
 * @param {object} query - Query params ya validados con Zod
 * @returns {object} Cláusula where para Prisma
 */
function buildWhereClause(query) {
  const where = {};

  if (query.operationType) {
    where.operationType = query.operationType;
  }

  if (query.propertyType) {
    where.propertyType = query.propertyType;
  }

  if (query.city) {
    where.city = { contains: query.city };
  }

  if (query.status) {
    where.status = query.status;
  }

  // Rango de precio
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) where.price.gte = query.minPrice;
    if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
  }

  // Dormitorios mínimos
  if (query.bedrooms !== undefined) {
    where.bedrooms = { gte: query.bedrooms };
  }

  // Búsqueda de texto libre (título, descripción, dirección, ciudad)
  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { description: { contains: query.search } },
      { address: { contains: query.search } },
      { city: { contains: query.search } },
    ];
  }

  return where;
}

module.exports = { generateSlug, buildWhereClause };
