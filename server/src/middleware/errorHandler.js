/**
 * Middleware global de manejo de errores.
 * Captura errores de Prisma, Zod, Multer y errores genéricos.
 */
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Log en desarrollo
  if (env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // ── Errores de Prisma ────────────────────────────────────
  if (err.code === 'P2002') {
    const field = err.meta?.target?.join(', ') || 'campo';
    return res.status(409).json({
      success: false,
      message: `Ya existe un registro con ese valor de ${field}.`,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Registro no encontrado.',
    });
  }

  // ── Errores de Zod ───────────────────────────────────────
  if (err.name === 'ZodError') {
    const messages = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Error de validación.',
      errors: messages,
    });
  }

  // ── Errores de Multer ────────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'El archivo excede el tamaño máximo permitido (5 MB).',
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Se excedió la cantidad máxima de archivos permitidos.',
    });
  }

  // ── Error genérico ───────────────────────────────────────
  const statusCode = err.statusCode || 500;
  const message =
    env.NODE_ENV === 'production' && statusCode === 500
      ? 'Error interno del servidor.'
      : err.message || 'Error interno del servidor.';

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { errorHandler };
