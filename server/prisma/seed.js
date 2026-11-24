/**
 * Seed script – crea el usuario admin y 6 propiedades demo
 * Ejecutar: node prisma/seed.js
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');

// Cargar variables de entorno desde server/.env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin user ──────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL || 'info@casanaspropiedades.com.ar';
  const password = process.env.ADMIN_PASSWORD || 'CasanasAdmin2024!';
  const name = process.env.ADMIN_NAME || 'Fernanda Casañas';
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash },
    create: {
      email,
      passwordHash,
      name,
    },
  });

  console.log(`✅ Admin user: ${admin.email}`);

  // ── Demo properties ─────────────────────────────────────────
  const properties = [
    {
      title: 'Departamento moderno en Palermo Soho',
      slug: 'departamento-moderno-palermo-soho',
      description:
        'Hermoso departamento de 3 ambientes en el corazón de Palermo Soho. Luminoso, con balcón terraza y vista abierta. Cocina integrada con mesada de granito, pisos de porcelanato y aire acondicionado en todos los ambientes. Edificio con amenities: piscina, SUM y gimnasio.',
      operationType: 'SALE',
      propertyType: 'APARTMENT',
      price: 185000,
      currency: 'USD',
      address: 'Honduras 4500',
      city: 'Buenos Aires',
      neighborhood: 'Palermo',
      surfaceTotal: 85,
      surfaceCovered: 75,
      bedrooms: 2,
      bathrooms: 1,
      garages: 1,
      age: 5,
      hasPool: true,
      hasGarden: false,
      hasSecurity: true,
      isFeatured: true,
      createdById: admin.id,
    },
    {
      title: 'Casa con jardín en San Isidro',
      slug: 'casa-jardin-san-isidro',
      description:
        'Espectacular casa de 4 dormitorios en barrio residencial de San Isidro. Amplio jardín con pileta y parrilla. Living-comedor con hogar a leña, cocina comedor diaria, suite principal con vestidor y baño en suite. Garage para dos autos. Alarma y cerco perimetral.',
      operationType: 'SALE',
      propertyType: 'HOUSE',
      price: 420000,
      currency: 'USD',
      address: 'Av. Libertador 16200',
      city: 'San Isidro',
      neighborhood: 'La Horqueta',
      surfaceTotal: 450,
      surfaceCovered: 280,
      bedrooms: 4,
      bathrooms: 3,
      garages: 2,
      age: 12,
      hasPool: true,
      hasGarden: true,
      hasSecurity: true,
      isFeatured: true,
      createdById: admin.id,
    },
    {
      title: 'Oficina premium en Puerto Madero',
      slug: 'oficina-premium-puerto-madero',
      description:
        'Oficina de categoría AAA en torre corporativa de Puerto Madero. Piso alto con vista al río. Incluye 4 despachos privados, sala de reuniones vidriada, open space para 12 puestos, office y 2 baños. Edificio inteligente con seguridad 24hs, cocheras disponibles.',
      operationType: 'RENT',
      propertyType: 'OFFICE',
      price: 8500,
      currency: 'USD',
      address: 'Juana Manso 1200',
      city: 'Buenos Aires',
      neighborhood: 'Puerto Madero',
      surfaceTotal: 220,
      surfaceCovered: 220,
      bedrooms: 0,
      bathrooms: 2,
      garages: 3,
      age: 8,
      hasPool: false,
      hasGarden: false,
      hasSecurity: true,
      isFeatured: true,
      createdById: admin.id,
    },
    {
      title: 'Departamento en Recoleta con vista al parque',
      slug: 'departamento-recoleta-vista-parque',
      description:
        'Elegante departamento de 4 ambientes en Recoleta, frente a la Plaza Francia. Pisos de roble, molduras originales restauradas. Living de 40m², cocina independiente equipada, dependencia de servicio. Edificio clásico con portería 24hs.',
      operationType: 'SALE',
      propertyType: 'APARTMENT',
      price: 320000,
      currency: 'USD',
      address: 'Av. del Libertador 1800',
      city: 'Buenos Aires',
      neighborhood: 'Recoleta',
      surfaceTotal: 160,
      surfaceCovered: 145,
      bedrooms: 3,
      bathrooms: 2,
      garages: 1,
      age: 35,
      hasPool: false,
      hasGarden: false,
      hasSecurity: true,
      isFeatured: false,
      createdById: admin.id,
    },
    {
      title: 'Local comercial en Belgrano',
      slug: 'local-comercial-belgrano',
      description:
        'Excelente local comercial sobre avenida Cabildo, zona de alto tránsito peatonal. Planta baja con vidriera al frente de 6 metros lineales, entrepiso y sótano. Ideal para gastronomía, retail o showroom. Habilitación comercial al día.',
      operationType: 'RENT',
      propertyType: 'COMMERCIAL',
      price: 3200,
      currency: 'USD',
      address: 'Av. Cabildo 2300',
      city: 'Buenos Aires',
      neighborhood: 'Belgrano',
      surfaceTotal: 180,
      surfaceCovered: 180,
      bedrooms: 0,
      bathrooms: 2,
      garages: 0,
      age: 20,
      hasPool: false,
      hasGarden: false,
      hasSecurity: false,
      isFeatured: false,
      createdById: admin.id,
    },
    {
      title: 'Casa en barrio cerrado Nordelta',
      slug: 'casa-barrio-cerrado-nordelta',
      description:
        'Moderna casa de 5 ambientes en barrio Los Lagos, Nordelta. Diseño minimalista con grandes ventanales al lago. Planta baja: living doble altura, comedor, cocina isla, toilette y dormitorio en suite. Planta alta: 3 dormitorios (suite principal con jacuzzi), estudio. Deck con pileta infinity y muelle propio.',
      operationType: 'SALE',
      propertyType: 'HOUSE',
      price: 650000,
      currency: 'USD',
      address: 'Barrio Los Lagos, Lote 45',
      city: 'Tigre',
      neighborhood: 'Nordelta',
      surfaceTotal: 800,
      surfaceCovered: 350,
      bedrooms: 4,
      bathrooms: 4,
      garages: 2,
      age: 3,
      hasPool: true,
      hasGarden: true,
      hasSecurity: true,
      isFeatured: false,
      createdById: admin.id,
    },
  ];

  // Image mapping for realistic demonstration
  const propertyImages = {
    'departamento-moderno-palermo-soho': [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', isCover: true, displayOrder: 0, altText: 'Living principal con balcón' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', isCover: false, displayOrder: 1, altText: 'Ambiente integrado' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', isCover: false, displayOrder: 2, altText: 'Dormitorio luminoso' },
    ],
    'casa-jardin-san-isidro': [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', isCover: true, displayOrder: 0, altText: 'Fachada con piscina' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', isCover: false, displayOrder: 1, altText: 'Cocina comedor diario' },
      { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', isCover: false, displayOrder: 2, altText: 'Parque y galería' },
    ],
    'oficina-premium-puerto-madero': [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', isCover: true, displayOrder: 0, altText: 'Open space corporativo' },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', isCover: false, displayOrder: 1, altText: 'Sala de reuniones' },
    ],
    'departamento-recoleta-vista-parque': [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', isCover: true, displayOrder: 0, altText: 'Living clásico con molduras' },
      { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', isCover: false, displayOrder: 1, altText: 'Pisos de parquet' },
    ],
    'local-comercial-belgrano': [
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', isCover: true, displayOrder: 0, altText: 'Salón principal al frente' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', isCover: false, displayOrder: 1, altText: 'Espacio de atención' },
    ],
    'casa-barrio-cerrado-nordelta': [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', isCover: true, displayOrder: 0, altText: 'Vista exterior con salida al lago' },
      { url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80', isCover: false, displayOrder: 1, altText: 'Living de doble altura' },
      { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80', isCover: false, displayOrder: 2, altText: 'Master suite con baño' },
    ],
  };

  // Crear o actualizar propiedades e imágenes
  for (const prop of properties) {
    const createdProperty = await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {},
      create: prop,
    });

    const images = propertyImages[prop.slug] || [];
    for (const img of images) {
      await prisma.propertyImage.create({
        data: {
          propertyId: createdProperty.id,
          url: img.url,
          altText: img.altText,
          isCover: img.isCover,
          displayOrder: img.displayOrder,
        },
      });
    }
  }

  console.log(`✅ ${properties.length} demo properties with high-res images created`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
