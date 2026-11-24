/**
 * Configuración de Multer para subida de imágenes.
 * Almacena en disco dentro de /uploads con nombres únicos.
 */
const multer = require('multer');
const path = require('path');
const env = require('../config/env');

// Tipos MIME permitidos
const ALLOWED_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Almacenamiento en disco
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}-${file.originalname.replace(ext, '')}${ext}`);
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
