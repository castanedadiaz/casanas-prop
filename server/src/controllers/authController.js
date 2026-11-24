/**
 * Controlador de autenticación
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const env = require('../config/env');

const prisma = new PrismaClient();

/**
 * POST /api/auth/login
 * Autentica un administrador y devuelve un JWT.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Buscar admin por email
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.',
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Devuelve el perfil del administrador autenticado.
 */
async function getMe(req, res, next) {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.',
      });
    }

    return res.json({
      success: true,
      user: admin,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/auth/profile
 * Actualiza nombre, email o contraseña del administrador autenticado.
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    const data = {};
    if (name && name.trim()) data.name = name.trim();
    if (email && email.trim()) data.email = email.trim().toLowerCase();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Debes ingresar tu contraseña actual para establecer una nueva.',
        });
      }

      const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isCurrentValid) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña actual ingresada es incorrecta.',
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'La nueva contraseña debe tener al menos 8 caracteres.',
        });
      }

      data.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.adminUser.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true },
    });

    return res.json({
      success: true,
      message: 'Credenciales actualizadas exitosamente.',
      user: updated,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  getMe,
  updateProfile,
};
