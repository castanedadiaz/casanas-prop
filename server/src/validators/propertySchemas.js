/**
 * Schemas de validación para propiedades (Zod)
 */
const { z } = require('zod');

// ── Enums ──────────────────────────────────────────────────
const operationTypes = ['SALE', 'RENT'];
const propertyTypes = ['HOUSE', 'APARTMENT', 'COMMERCIAL', 'LAND', 'OFFICE'];
const statusTypes = ['AVAILABLE', 'RESERVED', 'SOLD', 'RENTED'];
const sortOptions = ['price_asc', 'price_desc', 'newest', 'oldest'];

// ── Crear propiedad ────────────────────────────────────────
const createPropertySchema = z.object({
  title: z
    .string({ required_error: 'El título es obligatorio.' })
    .min(3, 'El título debe tener al menos 3 caracteres.')
    .max(200, 'El título no puede superar los 200 caracteres.'),
  description: z
    .string({ required_error: 'La descripción es obligatoria.' })
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .max(5000, 'La descripción no puede superar los 5000 caracteres.'),
  operationType: z.enum(operationTypes, {
    errorMap: () => ({ message: 'Tipo de operación inválido. Use SALE o RENT.' }),
  }),
  propertyType: z.enum(propertyTypes, {
    errorMap: () => ({
      message: 'Tipo de propiedad inválido. Use HOUSE, APARTMENT, COMMERCIAL, LAND u OFFICE.',
    }),
  }),
  price: z.coerce
    .number({ required_error: 'El precio es obligatorio.' })
    .positive('El precio debe ser positivo.'),
  currency: z.enum(['USD', 'ARS']).default('USD'),
  address: z
    .string({ required_error: 'La dirección es obligatoria.' })
    .min(3, 'La dirección debe tener al menos 3 caracteres.'),
  city: z
    .string({ required_error: 'La ciudad es obligatoria.' })
    .min(2, 'La ciudad debe tener al menos 2 caracteres.'),
  neighborhood: z.string().optional().nullable(),
  surfaceTotal: z.coerce
    .number({ required_error: 'La superficie total es obligatoria.' })
    .positive('La superficie total debe ser positiva.'),
  surfaceCovered: z.coerce
    .number({ required_error: 'La superficie cubierta es obligatoria.' })
    .positive('La superficie cubierta debe ser positiva.'),
  bedrooms: z.coerce.number().int().min(0).default(0),
  bathrooms: z.coerce.number().int().min(0).default(0),
  garages: z.coerce.number().int().min(0).default(0),
  age: z.coerce.number().int().min(0).default(0),
  hasPool: z.coerce.boolean().default(false),
  hasGarden: z.coerce.boolean().default(false),
  hasSecurity: z.coerce.boolean().default(false),
  status: z.enum(statusTypes).optional().default('AVAILABLE'),
  isFeatured: z.coerce.boolean().default(false),
  isVisible: z.coerce.boolean().default(true),
});

// ── Actualizar propiedad (todos los campos opcionales) ─────
const updatePropertySchema = createPropertySchema.partial();

// ── Actualizar estado ──────────────────────────────────────
const updateStatusSchema = z.object({
  status: z.enum(statusTypes, {
    errorMap: () => ({ message: 'Estado inválido. Use AVAILABLE, RESERVED, SOLD o RENTED.' }),
  }).optional(),
  isVisible: z.coerce.boolean().optional(),
});

// ── Query params de búsqueda ───────────────────────────────
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(500).default(12),
  operationType: z.enum(operationTypes).optional(),
  propertyType: z.enum(propertyTypes).optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  status: z.enum(statusTypes).optional(),
  search: z.string().optional(),
  sortBy: z.enum(sortOptions).default('newest'),
  hasPool: z.coerce.boolean().optional(),
  hasGarden: z.coerce.boolean().optional(),
  hasSecurity: z.coerce.boolean().optional(),
});

module.exports = {
  createPropertySchema,
  updatePropertySchema,
  updateStatusSchema,
  querySchema,
  operationTypes,
  propertyTypes,
  statusTypes,
};
