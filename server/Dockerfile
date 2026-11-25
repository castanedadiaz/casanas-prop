# ==============================================================
# Dockerfile para Google Cloud Run – Casañas Propiedades Backend
# ==============================================================

FROM node:20-alpine AS runner

WORKDIR /app

# Instalar dependencias necesarias para compilar librerías nativas si hiciera falta
RUN apk add --no-cache openssl libc6-compat

# Copiar manifiestos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias de producción
RUN npm install --omit=dev

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar el código fuente
COPY src ./src

# Crear directorio de uploads temporal y correr como usuario sin privilegios
RUN mkdir -p uploads && chown -R node:node /app
USER node

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "src/app.js"]

