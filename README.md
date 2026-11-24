# 🏠 CASAÑAS PROPIEDADES — Plataforma Inmobiliaria Full-Stack

Plataforma web moderna, de alto rendimiento y segura desarrollada para la inmobiliaria **CASAÑAS PROPIEDADES**.

---

## 🎨 Identidad Visual
- **Paleta de marca:**
  - Primario: Verde bosque profundo (`#1A3C2A`)
  - Acento: Dorado champagne (`#C6A96C`)
  - Fondo: Crema suave (`#FAF8F2`)
- **Tipografías:** *Playfair Display* (títulos distinguidos) + *Inter* (cuerpo y datos técnicos).

---

## 🚀 Inicio Rápido en Desarrollo Local

### Requisitos
- Node.js (v18 o superior)
- npm

### 1. Clonar e instalar dependencias
```bash
# Instalar todo con un solo comando desde la raíz
npm run setup
```

### 2. Iniciar servidores (Frontend + Backend en simultáneo)
```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3001](http://localhost:3001)
- **Panel de Administración:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

---

## 🔐 Credenciales del Panel de Control (Seed)

- **Email:** `admin@casanaspropiedades.com`
- **Contraseña:** `CasanasAdmin2024!`

---

## 📦 Estructura del Proyecto

```
Casanas-prop/
├── client/                     # Frontend (React 18, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Componentes UI, Layout, Propiedades y Admin
│   │   ├── context/            # Store Zustand de autenticación
│   │   ├── pages/              # Vistas: Home, Catálogo, Detalle, Admin Dashboard, etc.
│   │   ├── services/           # Clientes HTTP (Axios) para Auth y Propiedades
│   │   └── utils/              # Formateadores de moneda, fechas y constantes
│   └── vercel.json             # Reglas de reescritura SPA para despliegue
│
├── server/                     # Backend API (Node.js, Express, Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos de Base de Datos
│   │   └── seed.js             # Datos demo con fotos de alta resolución
│   ├── src/
│   │   ├── controllers/        # Controladores de Auth y Propiedades
│   │   ├── middleware/         # Autenticación JWT, Multer y Zod validation
│   │   ├── routes/             # Endpoints REST
│   │   └── validators/         # Esquemas de validación Zod
│   └── uploads/                # Directorio de fotos procesadas en WebP
│
└── package.json                # Scripts raíz para ejecución concurrente
```

---

## 🌐 Guía de Despliegue en Producción

### Opción Recomendada:

1. **Frontend en Vercel:**
   - Crear proyecto importando este repositorio.
   - Establecer `Root Directory` en `client`.
   - `Framework Preset`: Vite.
   - En variables de entorno agregar:
     - `VITE_API_URL`: URL del backend en producción (ej. `https://api.casanaspropiedades.com`).

2. **Backend en Railway o Render:**
   - Crear nuevo proyecto apuntando a la carpeta `server`.
   - Configurar variables de entorno copiadas de `server/.env`.
   - Modificar `server/prisma/schema.prisma` para usar PostgreSQL en producción.

3. **Base de Datos PostgreSQL (Supabase o Neon):**
   - Crear proyecto gratuito y copiar la URL de conexión `DATABASE_URL` a las variables del backend.
   - Ejecutar `npx prisma db push` para crear las tablas.

4. **Dominio Propio con Cloudflare:**
   - Apuntar el dominio principal a Vercel (`CNAME cname.vercel-dns.com`).
   - Apuntar el subdominio de la API a Railway (`CNAME ...`).
   - Activar el proxy naranja de Cloudflare para SSL automático y caché en borde.

---

## 📱 Contacto de WhatsApp
El botón flotante y las consultas en cada propiedad están vinculados directamente a la línea oficial:
👉 **[wa.me/5492234480357](https://wa.me/5492234480357)**

