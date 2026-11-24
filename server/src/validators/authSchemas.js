/**
 * Schemas de validación para autenticación (Zod)
 */
const { z } = require('zod');

/** Schema para login de administrador */
const loginSchema = z.object({
  email: z
    .string({ required_error: 'El email es obligatorio.' })
    .email('Debe ser un email válido.'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria.' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

module.exports = { loginSchema };
