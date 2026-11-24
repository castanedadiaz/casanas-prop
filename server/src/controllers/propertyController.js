/**
 * Controlador de propiedades
 * Maneja CRUD completo, filtros, paginación y gestión de imágenes.
 */
const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { generateSlug, buildWhereClause } = require('../utils/helpers');
const { querySchema } = require('../validators/propertySchemas');
const storageService = require('../services/storageService');

const prisma = new PrismaClient();
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

// ═══════════════════════════════════════════════════════════
//  PÚBLICOS
// ═══════════════════════════════════════════════════════════

/**
 * GET /api/properties
 * Lista propiedades con filtros, búsqueda y paginación.
 */
async function getProperties(req, res, next) {
  try {
    // Validar query params
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros de consulta inválidos.',
        errors: parsed.error.errors,
      });
    }

    const { page, limit, sortBy, ...filters } = parsed.data;

    // Construir where clause (solo visibles para público)
    const where = buildWhereClause(filters);
    where.isVisible = true;

    // Ordenamiento
    let orderBy = { createdAt: 'desc' }; // default: newest
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    else if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    else if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };

    // Contar total
    const total = await prisma.property.count({ where });
    const totalPages = Math.ceil(total / limit);

    // Obtener propiedades
    const properties = await prisma.property.findMany({
      where,
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return res.json({
      success: true,
      properties,
      pagination: { page, limit, total, totalPages },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/properties/featured
 * Devuelve hasta 6 propiedades destacadas visibles.
 */
async function getFeaturedProperties(req, res, next) {
  try {
    const properties = await prisma.property.findMany({
      where: { isFeatured: true, isVisible: true },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    return res.json({ success: true, properties });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/properties/:slug
 * Obtiene una propiedad por su slug. Admins pueden ver no-visibles.
 */
async function getPropertyBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const property = await prisma.property.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada.',
      });
    }

    // Si no es visible, solo un admin autenticado puede verla
    if (!property.isVisible && !req.user) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada.',
      });
    }

    return res.json({ success: true, property });
  } catch (error) {
    next(error);
  }
}

// ═══════════════════════════════════════════════════════════
//  ADMIN – CRUD
// ═══════════════════════════════════════════════════════════

/**
 * POST /api/properties
 * Crea una nueva propiedad (con imágenes opcionales).
 */
async function createProperty(req, res, next) {
  try {
    // Parsear campos numéricos/booleanos que llegan como strings por multipart
    const body = parseMultipartBody(req.body);

    // Generar slug único
    let slug = generateSlug(body.title);

    // Verificar que el slug no exista
    const existing = await prisma.property.findUnique({ where: { slug } });
    if (existing) {
      slug = generateSlug(body.title); // regenerar con nuevo sufijo
    }

    // Crear propiedad
    const property = await prisma.property.create({
      data: {
        ...body,
        slug,
        createdById: req.user.id,
      },
    });

    // Procesar imágenes si se subieron
    if (req.files && req.files.length > 0) {
      await processAndSaveImages(req.files, property.id);
    }

    // Devolver con imágenes incluidas
    const result = await prisma.property.findUnique({
      where: { id: property.id },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });

    return res.status(201).json({ success: true, property: result });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/properties/:id
 * Actualiza una propiedad existente.
 */
async function updateProperty(req, res, next) {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    // Limpiar campos que no deben enviarse en la actualización directa de Prisma
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.createdById;
    delete data.createdBy;
    delete data.images;

    // Si cambia el título, regenerar slug
    if (data.title) {
      data.slug = generateSlug(data.title);
    }

    const property = await prisma.property.update({
      where: { id },
      data,
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });

    return res.json({ success: true, property });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/properties/:id/status
 * Actualiza solo el estado y visibilidad de una propiedad.
 */
async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, isVisible } = req.body;

    const data = {};
    if (status !== undefined) data.status = status;
    if (isVisible !== undefined) data.isVisible = isVisible;

    const property = await prisma.property.update({
      where: { id },
      data,
    });

    return res.json({ success: true, property });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/properties/:id
 * Oculta la propiedad (soft-delete) o la elimina permanentemente.
 * Query param: ?permanent=true para eliminar definitivamente.
 */
async function deleteProperty(req, res, next) {
  try {
    const { id } = req.params;
    const permanent = req.query.permanent === 'true';

    if (permanent) {
      // Obtener imágenes para eliminar archivos del disco
      const images = await prisma.propertyImage.findMany({
        where: { propertyId: id },
      });

      // Eliminar archivos del disco
      for (const img of images) {
        const filePath = path.resolve(UPLOADS_DIR, path.basename(img.url));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Eliminar propiedad (cascade elimina PropertyImage)
      await prisma.property.delete({ where: { id } });

      return res.json({
        success: true,
        message: 'Propiedad eliminada permanentemente.',
      });
    }

    // Soft-delete: ocultar
    await prisma.property.update({
      where: { id },
      data: { isVisible: false },
    });

    return res.json({
      success: true,
      message: 'Propiedad ocultada.',
    });
  } catch (error) {
    next(error);
  }
}

// ═══════════════════════════════════════════════════════════
//  ADMIN – IMÁGENES
// ═══════════════════════════════════════════════════════════

/**
 * POST /api/properties/:id/images
 * Agrega imágenes a una propiedad existente.
 */
async function addImages(req, res, next) {
  try {
    const { id } = req.params;

    // Verificar que la propiedad exista
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada.',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se enviaron imágenes.',
      });
    }

    await processAndSaveImages(req.files, id);

    // Devolver propiedad actualizada
    const updated = await prisma.property.findUnique({
      where: { id },
      include: { images: { orderBy: { displayOrder: 'asc' } } },
    });

    return res.json({ success: true, property: updated });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/properties/images/:imageId
 * Elimina una imagen específica y su archivo del disco.
 */
async function deleteImage(req, res, next) {
  try {
    const { imageId } = req.params;

    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada.',
      });
    }

    // Eliminar archivo físico (GCS o local)
    await storageService.deletePropertyImage(image.url, UPLOADS_DIR);

    // Eliminar registro
    await prisma.propertyImage.delete({ where: { id: imageId } });

    return res.json({
      success: true,
      message: 'Imagen eliminada.',
    });
  } catch (error) {
    next(error);
  }
}

// ═══════════════════════════════════════════════════════════
//  HELPERS PRIVADOS
// ═══════════════════════════════════════════════════════════

/**
 * Procesa imágenes con Sharp (resize + webp) y las guarda como PropertyImage.
 * @param {Express.Multer.File[]} files - Archivos subidos por Multer
 * @param {string} propertyId - ID de la propiedad
 */
async function processAndSaveImages(files, propertyId) {
  // Contar imágenes existentes para determinar displayOrder y isCover
  const existingCount = await prisma.propertyImage.count({
    where: { propertyId },
  });

  const imageRecords = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const webpFilename = `${Date.now()}-${i}-${Math.round(Math.random() * 1e6)}.webp`;

    // Redimensionar y convertir a WebP en buffer
    const webpBuffer = await sharp(file.path)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Eliminar archivo temporal original de multer
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Guardar (en Google Cloud Storage o en local /uploads)
    const publicUrl = await storageService.savePropertyImage(webpBuffer, webpFilename, UPLOADS_DIR);

    imageRecords.push({
      propertyId,
      url: publicUrl,
      displayOrder: existingCount + i,
      isCover: existingCount === 0 && i === 0, // primera imagen global es cover
    });
  }

  // Guardar registros en la base de datos
  await prisma.propertyImage.createMany({ data: imageRecords });
}

/**
 * Parsea campos de un body multipart (strings → tipos correctos).
 * Multer envía todo como string cuando se usa FormData.
 */
function parseMultipartBody(body) {
  const parsed = { ...body };

  // Campos numéricos
  const numericFields = [
    'price', 'surfaceTotal', 'surfaceCovered',
    'bedrooms', 'bathrooms', 'garages', 'age',
  ];
  for (const field of numericFields) {
    if (parsed[field] !== undefined) {
      parsed[field] = Number(parsed[field]);
    }
  }

  // Campos booleanos
  const booleanFields = ['hasPool', 'hasGarden', 'hasSecurity', 'isFeatured', 'isVisible'];
  for (const field of booleanFields) {
    if (parsed[field] !== undefined) {
      parsed[field] = parsed[field] === 'true' || parsed[field] === true;
    }
  }

  return parsed;
}

module.exports = {
  getProperties,
  getFeaturedProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  updateStatus,
  deleteProperty,
  addImages,
  deleteImage,
};
