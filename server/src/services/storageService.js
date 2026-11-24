/**
 * Servicio de almacenamiento híbrido (Local / Google Cloud Storage)
 * - En local: guarda en la carpeta /uploads
 * - En producción con GCS_BUCKET_NAME: sube automáticamente al Bucket de Google Cloud
 */
const path = require('path');
const fs = require('fs');

const BUCKET_NAME = process.env.GCS_BUCKET_NAME;

let gcsStorage = null;
if (BUCKET_NAME) {
  try {
    const { Storage } = require('@google-cloud/storage');
    gcsStorage = new Storage();
  } catch (err) {
    console.warn('⚠️ @google-cloud/storage no está instalado, usando almacenamiento local.');
  }
}

/**
 * Guarda un buffer o archivo en el destino correspondiente (GCS o Local).
 * @param {Buffer} buffer - Buffer de la imagen convertida a WebP
 * @param {string} filename - Nombre del archivo final .webp
 * @param {string} localUploadsDir - Ruta local de uploads
 * @returns {Promise<string>} URL accesible de la imagen
 */
async function savePropertyImage(buffer, filename, localUploadsDir) {
  // Si está configurado Google Cloud Storage
  if (BUCKET_NAME && gcsStorage) {
    const bucket = gcsStorage.bucket(BUCKET_NAME);
    const file = bucket.file(`properties/${filename}`);

    await file.save(buffer, {
      contentType: 'image/webp',
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    // URL pública directa de Google Cloud Storage
    return `https://storage.googleapis.com/${BUCKET_NAME}/properties/${filename}`;
  }

  // Modo local por defecto
  const localPath = path.join(localUploadsDir, filename);
  fs.writeFileSync(localPath, buffer);
  return `/uploads/${filename}`;
}

/**
 * Elimina una imagen del almacenamiento.
 * @param {string} imageUrl - URL o path relativo guardado en la base de datos
 * @param {string} localUploadsDir - Directorio local
 */
async function deletePropertyImage(imageUrl, localUploadsDir) {
  if (BUCKET_NAME && gcsStorage && imageUrl.includes('storage.googleapis.com')) {
    try {
      const filename = imageUrl.split('/').pop();
      const bucket = gcsStorage.bucket(BUCKET_NAME);
      await bucket.file(`properties/${filename}`).delete({ ignoreNotFound: true });
    } catch (err) {
      console.error('Error al eliminar de GCS:', err.message);
    }
    return;
  }

  // Eliminar archivo local
  const filename = path.basename(imageUrl);
  const localPath = path.join(localUploadsDir, filename);
  if (fs.existsSync(localPath)) {
    fs.unlinkSync(localPath);
  }
}

module.exports = {
  savePropertyImage,
  deletePropertyImage,
};

