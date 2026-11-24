import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Shield,
  Award,
  Users,
  ArrowRight,
  MessageCircle,
  Scale,
  BadgeCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { getFeaturedProperties } from '../services/propertyService'
import SearchBar from '../components/properties/SearchBar'
import PropertyGrid from '../components/properties/PropertyGrid'
import Button from '../components/ui/Button'
import { WHATSAPP_NUMBER } from '../utils/constants'

// Componente para avatar de equipo con foto compacta y fallback elegante
function TeamMemberAvatar({ src, alt, initials }) {
  const [imgError, setImgError] = useState(false)

  if (imgError || !src) {
    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-secondary font-display text-2xl font-bold shadow-md border-2 border-secondary/40 shrink-0">
        {initials}
      </div>
    )
  }

  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-secondary/40 shadow-md bg-white shrink-0 group">
      <img
        src={src}
        alt={alt}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  )
}

export default function HomePage() {
  const { data: featuredProperties, isLoading } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: getFeaturedProperties,
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-primary via-primary-dark to-primary text-white px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Subtle decorative pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C6A96C_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/40 text-secondary-light px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            <span>Inmobiliaria de Excelencia</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Encontrá el espacio que siempre soñaste
          </h1>

          <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Asesoramiento personalizado, transparencia y las propiedades más exclusivas en venta y alquiler en Buenos Aires.
          </p>

          {/* Hero Search Bar */}
          <div className="pt-4 max-w-4xl mx-auto text-left">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-secondary-dark text-xs font-bold uppercase tracking-wider mb-2">
              <span>Selección Exclusiva</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary">
              Propiedades Destacadas
            </h2>
          </div>
          <Link to="/propiedades">
            <Button variant="outline" size="md">
              Ver todo el catálogo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <PropertyGrid
          properties={featuredProperties}
          loading={isLoading}
          emptyMessage="No hay propiedades destacadas en este momento"
        />
      </section>

      {/* Quiénes Somos / Equipo Profesional */}
      <section id="nosotros" className="scroll-mt-24 bg-white border-t border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-secondary-dark bg-secondary/10 px-3.5 py-1.5 rounded-full border border-secondary/20">
              <BadgeCheck className="h-4 w-4 text-secondary-dark" />
              Equipo Profesional & Respaldo Legal
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              Quiénes Somos
            </h2>
            <p className="text-gray-600 text-base sm:text-lg font-light leading-relaxed">
              En <strong className="font-semibold text-primary">Casañas Propiedades</strong> creemos que comprar, vender o alquilar un inmueble es una decisión de vida trascendental. Por eso, combinamos el corretaje inmobiliario colegiado con el asesoramiento jurídico integral para brindarte máxima tranquilidad y certeza en cada operación.
            </p>
          </div>

          {/* Cards de los dos titulares */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Fernanda Casañas */}
            <article className="bg-[#FAF8F2] rounded-3xl p-6 sm:p-8 border border-secondary/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 mb-6 text-center sm:text-left">
                  <TeamMemberAvatar
                    src="/team/fernanda.jpg"
                    alt="Fernanda Casañas - Martillera y Corredora Pública"
                    initials="FC"
                  />

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="font-display text-2xl font-bold text-primary">
                        Fernanda Casañas
                      </h3>
                      <span className="inline-flex items-center gap-1 bg-primary text-secondary text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        <Award className="h-3.5 w-3.5" />
                        Reg. 1680
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-secondary-dark uppercase tracking-wider">
                      Martillera y Corredora Pública
                    </p>
                    <p className="text-xs text-gray-500">
                      Dirección Comercial & Operativa
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  A cargo de la dirección comercial y operativa. Con matrícula profesional habilitante, se enfoca en tasaciones fidedignas y en diseñar estrategias de comercialización efectivas para que tu propiedad alcance su valor real en el mercado.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-secondary/20 text-xs text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Matrícula oficial y colegiada activa (Reg. 1680)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Tasaciones profesionales basadas en análisis real de mercado</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Atención y gestión personalizada de cada inmueble</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Ricardo Fiante */}
            <article className="bg-[#FAF8F2] rounded-3xl p-6 sm:p-8 border border-secondary/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 mb-6 text-center sm:text-left">
                  <TeamMemberAvatar
                    src="/team/ricardo.jpg"
                    alt="Ricardo Fiante - Abogado"
                    initials="RF"
                  />

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="font-display text-2xl font-bold text-primary">
                        Ricardo Fiante
                      </h3>
                      <span className="inline-flex items-center gap-1 bg-primary text-secondary text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        <Scale className="h-3.5 w-3.5" />
                        Área Legal
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-secondary-dark uppercase tracking-wider">
                      Abogado
                    </p>
                    <p className="text-xs text-gray-500">
                      Asesoramiento Jurídico Integral
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  Especialista en derecho inmobiliario y contractual. Supervisa y audita cada trámite legal para blindar patrimonialmente tus operaciones: desde el estudio de títulos e inhibiciones hasta la firma de boletos y escrituras.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-secondary/20 text-xs text-gray-600">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Análisis preventivo de títulos, gravámenes y sucesiones</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Redacción minuciosa de contratos y reservas seguras</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Acompañamiento jurídico de principio a fin</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sello de Confianza y Respaldo */}
          <div className="bg-gradient-to-r from-primary via-primary-dark to-primary text-white rounded-3xl p-8 sm:p-10 border border-secondary/40 shadow-xl max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-secondary text-xs uppercase tracking-widest font-bold">
                Tu patrimonio en manos de profesionales
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold">
                La tranquilidad de operar con Martillera Colegiada y Abogado
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm max-w-2xl font-light">
                Evitá intermediarios improvisados o franquicias sin matrícula propia. En Casañas Propiedades contás con diálogo directo, matriculación oficial y respaldo legal en una misma firma.
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hola, me gustaría coordinar una reunión o tasación con el equipo de Casañas Propiedades.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-secondary hover:bg-secondary-light text-primary font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-lg transition-all active:scale-95 text-center"
            >
              Coordinar Entrevista
            </a>
          </div>
        </div>
      </section>

      {/* Values & Trust Section */}
      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary-dark">
              ¿Por qué elegirnos?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary mt-2">
              Compromiso y Solidez Inmobiliaria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cream rounded-2xl p-8 text-center space-y-4 border border-secondary/20 hover:border-secondary transition">
              <div className="h-14 w-14 rounded-2xl bg-primary text-secondary flex items-center justify-center mx-auto shadow-md">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary">Seguridad Jurídica</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Verificación exhaustiva de títulos, contratos transparentes y acompañamiento legal en cada paso de la operación.
              </p>
            </div>

            <div className="bg-cream rounded-2xl p-8 text-center space-y-4 border border-secondary/20 hover:border-secondary transition">
              <div className="h-14 w-14 rounded-2xl bg-primary text-secondary flex items-center justify-center mx-auto shadow-md">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary">Trayectoria y Experiencia</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Conocimiento profundo del mercado inmobiliario para asesorarte con valuaciones precisas y realistas.
              </p>
            </div>

            <div className="bg-cream rounded-2xl p-8 text-center space-y-4 border border-secondary/20 hover:border-secondary transition">
              <div className="h-14 w-14 rounded-2xl bg-primary text-secondary flex items-center justify-center mx-auto shadow-md">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary">Atención Personalizada</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cada cliente es único. Te brindamos un trato directo, ágil y enfocado en tus necesidades y tiempos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20 border-t-2 border-secondary relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            ¿Querés vender o alquilar tu propiedad?
          </h2>
          <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Tasamos tu inmueble sin cargo y lo posicionamos ante los compradores indicados con fotografía profesional y difusión integral.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hola, quisiera tasar mi propiedad con Casañas Propiedades.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-8 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              Contactar por WhatsApp
            </a>
            <Link to="/propiedades">
              <Button variant="goldOutline" size="lg" className="text-white hover:bg-secondary">
                Ver Inmuebles Disponibles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

