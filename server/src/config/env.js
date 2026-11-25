/**
 * Configuración centralizada de variables de entorno.
 * dotenv.config() se invoca en app.js antes de importar este módulo.
 */

const env = {
  // Server
  PORT: parseInt(process.env.PORT, 10) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // WhatsApp
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || '5492234480357',

  // Client
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // File uploads
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880, // 5 MB
  MAX_FILES_PER_PROPERTY: parseInt(process.env.MAX_FILES_PER_PROPERTY, 10) || 15,
};

// En producción, negarse a arrancar con un JWT_SECRET ausente, débil o de ejemplo.
if (env.NODE_ENV === 'production') {
  const weak = !process.env.JWT_SECRET
    || env.JWT_SECRET.length < 32
    || /change|default|example|generar/i.test(env.JWT_SECRET);
  if (weak) {
    console.error('❌ JWT_SECRET ausente o inseguro en producción. Abortando.');
    process.exit(1);
  }
}

module.exports = env;
