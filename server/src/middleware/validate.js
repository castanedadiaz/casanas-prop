/**
 * Middleware factory de validación con Zod.
 * Parsea req.body contra el schema proporcionado.
 */

/**
 * Retorna un middleware que valida req.body con el schema de Zod dado.
 * @param {import('zod').ZodSchema} schema - Schema de Zod
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación.',
        errors,
      });
    }

    // Reemplazar body con los datos parseados (incluye defaults y coercion)
    req.body = result.data;
    next();
  };
}

module.exports = { validate };
