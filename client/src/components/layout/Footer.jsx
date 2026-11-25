import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram } from 'lucide-react'
import { WHATSAPP_NUMBER, INSTAGRAM_URL } from '../../utils/constants'

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-white p-2.5 rounded-2xl inline-block shadow-md border border-secondary/30">
              <img
                src="/logo.png"
                alt="Casañas Propiedades"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Servicios inmobiliarios de excelencia. Asesoramiento profesional colegiado y respaldo jurídico en cada operación.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-secondary text-base font-semibold mb-4 tracking-wide uppercase text-sm">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-secondary transition">Inicio</Link>
              </li>
              <li>
                <a href="/#nosotros" className="hover:text-secondary transition">Quiénes Somos</a>
              </li>
              <li>
                <Link to="/propiedades" className="hover:text-secondary transition">Todas las Propiedades</Link>
              </li>
              <li>
                <Link to="/propiedades?operationType=SALE" className="hover:text-secondary transition">Propiedades en Venta</Link>
              </li>
              <li>
                <Link to="/propiedades?operationType=RENT" className="hover:text-secondary transition">Propiedades en Alquiler</Link>
              </li>
            </ul>
          </div>

          {/* Types */}
          <div>
            <h4 className="font-display text-secondary text-base font-semibold mb-4 tracking-wide uppercase text-sm">
              Tipos de Inmuebles
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/propiedades?propertyType=HOUSE" className="hover:text-secondary transition">Casas</Link>
              </li>
              <li>
                <Link to="/propiedades?propertyType=APARTMENT" className="hover:text-secondary transition">Departamentos</Link>
              </li>
              <li>
                <Link to="/propiedades?propertyType=COMMERCIAL" className="hover:text-secondary transition">Locales Comerciales</Link>
              </li>
              <li>
                <Link to="/propiedades?propertyType=LAND" className="hover:text-secondary transition">Terrenos y Lotes</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-secondary text-base font-semibold mb-4 tracking-wide uppercase text-sm">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-secondary shrink-0 mt-1" />
                <span>Mar del Plata, Buenos Aires</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <a href="tel:+5492234480357" className="hover:text-secondary transition">+54 9 223 448-0357</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-secondary shrink-0" />
                <a href="mailto:info@casanaspropiedades.com.ar" className="hover:text-secondary transition">info@casanaspropiedades.com.ar</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-secondary shrink-0" />
                <span>Lun a Vie: 9:00 a 18:00 hs</span>
              </li>
            </ul>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold py-2 px-3 rounded-lg transition"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                WhatsApp
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white text-xs font-semibold py-2 px-3 rounded-lg transition shadow"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary-light flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} CASAÑAS PROPIEDADES. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseño y desarrollo exclusivo para Casañas Propiedades
          </p>
        </div>
      </div>
    </footer>
  )
}

