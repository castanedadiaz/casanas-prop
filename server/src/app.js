/**
 * Casañas Propiedades – API Principal
 * Entry point del servidor Express.
 */
const path = require('path');

// Cargar variables de entorno ANTES de cualquier otra importación
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// ── Crear app ──────────────────────────────────────────────
const app = express();

// Confiar en el proxy de Google Cloud Run para IP real y rate-limiting
app.set('trust proxy', 1);

// ── Seguridad ──────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // permitir cargar imágenes desde el cliente
}));

// ── CORS ───────────────────────────────────────────────────
const rawOrigins = env.CLIENT_URL || '*';
const allowedOrigins = rawOrigins.split(',').map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (ej. curl, SSR) o si coincide con los permitidos
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origen ${origin} no permitido por CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Logging ────────────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Body parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting (rutas API) ──────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Demasiadas solicitudes. Intente de nuevo en 15 minutos.',
  },
});
app.use('/api', apiLimiter);

// ── Archivos estáticos (imágenes) ──────────────────────────
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Casañas Propiedades API funcionando correctamente.' });
});

// ── Rutas ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// ── Manejo global de errores ───────────────────────────────
app.use(errorHandler);

// ── Iniciar servidor ───────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`\n🏠 Casañas Propiedades API`);
  console.log(`   Servidor corriendo en http://localhost:${env.PORT}`);
  console.log(`   Entorno: ${env.NODE_ENV}`);
  console.log(`   Cliente: ${env.CLIENT_URL}\n`);
});

module.exports = app;
