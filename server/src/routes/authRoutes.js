/**
 * Rutas de autenticación
 */
const { Router } = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { loginSchema } = require('../validators/authSchemas');

const router = Router();

// POST /api/auth/login – Iniciar sesión
router.post('/login', validate(loginSchema), authController.login);

// GET /api/auth/me – Perfil del admin autenticado
router.get('/me', authenticate, authController.getMe);

// PUT /api/auth/profile – Actualizar credenciales / contraseña
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
