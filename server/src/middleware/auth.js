/**
 * Middleware de autenticación JWT.
 * Verifica el token Bearer y adjunta req.user.
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Protege rutas que requieren autenticación estricta de admin.
 */
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no proporcionado.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Adjuntar datos del usuario al request
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
    });
  }
}

/**
 * Autenticación opcional: si hay token válido, adjunta req.user sin rechazar.
 */
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = { id: decoded.id, email: decoded.email };
    }
  } catch (error) {
    // Token inválido o expirado, se continúa como público
  }
  next();
}

module.exports = { authenticate, optionalAuth };
