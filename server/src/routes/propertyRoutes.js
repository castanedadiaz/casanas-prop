/**
 * Rutas de propiedades
 */
const { Router } = require('express');
const propertyController = require('../controllers/propertyController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');
const { validate } = require('../middleware/validate');
const {
  updatePropertySchema,
  updateStatusSchema,
} = require('../validators/propertySchemas');

const router = Router();

// ── Rutas públicas (con auth opcional para detectar administradores) ──
router.get('/', optionalAuth, propertyController.getProperties);
router.get('/featured', optionalAuth, propertyController.getFeaturedProperties);
router.get('/:slug', optionalAuth, propertyController.getPropertyBySlug);

// ── Rutas protegidas (admin) ───────────────────────────────
router.post('/', authenticate, uploadImages, propertyController.createProperty);
router.put('/:id', authenticate, validate(updatePropertySchema), propertyController.updateProperty);
router.patch('/:id/status', authenticate, validate(updateStatusSchema), propertyController.updateStatus);
router.delete('/:id', authenticate, propertyController.deleteProperty);

// ── Gestión de imágenes (admin) ────────────────────────────
router.post('/:id/images', authenticate, uploadImages, propertyController.addImages);
router.delete('/images/:imageId', authenticate, propertyController.deleteImage);

module.exports = router;
