/**
 * Configuración de Multer para subida de imágenes.
 * Almacena en disco dentro de /uploads con nombres únicos.
 */
const multer = require('multer');
const path = require('path');
const env = require('../config/env');

// Tipos MIME permitidos
const ALLOWED_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
const crypto = require('crypto');

// Almacenamiento en disco
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    // Nunca usar el nombre original del cliente (evita path traversal / caracteres raros)
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const ext = EXT_BY_MIME[file.mimetype] || '.img';
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// Filtro de archivos
const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no permitido. Use JPEG, PNG o WebP.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
});

/** Middleware para subir múltiples imágenes (campo 'images') */
const uploadImages = upload.array('images', env.MAX_FILES_PER_PROPERTY);

module.exports = { uploadImages };
