import React from 'react'
import { getWhatsAppLink } from '../../utils/formatters'
import clsx from 'clsx'

// Ícono SVG oficial y nítido de WhatsApp
function WhatsAppIcon({ className = 'h-6 w-6' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.776.979-.952 1.18-.175.2-.351.225-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.463.132-.613.135-.135.301-.351.451-.527.151-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.676-1.63-.926-2.232-.244-.586-.492-.507-.676-.516l-.576-.01c-.2 0-.526.075-.801.376-.276.3-1.053 1.028-1.053 2.508s1.078 2.909 1.228 3.11c.15.2 2.122 3.24 5.14 4.543.718.31 1.278.495 1.716.634.721.23 1.377.198 1.896.12.577-.087 1.78-.727 2.03-1.43.251-.702.251-1.304.175-1.43-.075-.125-.276-.2-.576-.35zm-5.467 7.424h-.006a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982 1-3.647-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.43-9.875 9.878-9.875 2.64 0 5.12 1.028 6.984 2.893a9.82 9.82 0 012.89 6.985c0 5.447-4.431 9.888-9.869 9.888zm8.413-18.297A11.815 11.815 0 0012.005 0C5.395 0 .019 5.378.016 11.99a11.9 11.9 0 001.626 6.002L0 24l6.177-1.62a11.93 11.93 0 005.827 1.516h.005c6.608 0 11.986-5.378 11.989-11.99 0-3.204-1.248-6.216-3.58-8.489z" />
    </svg>
  )
}

export default function WhatsAppButton({
  propertyTitle = '',
  propertyId = '',
  variant = 'button',
  text = 'Consultar por WhatsApp',
  className = '',
}) {
  const link = getWhatsAppLink(propertyTitle, propertyId)

  // Botón flotante redondo con el logo oficial de WhatsApp
  if (variant === 'floating') {
    return (
      <aside aria-label="Contacto directo por WhatsApp">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp a Casañas Propiedades"
          title="Contactar por WhatsApp"
          className={clsx(
            'fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#25D366]/40',
            className
          )}
        >
          <WhatsAppIcon className="h-7 w-7" />
          
          {/* Tooltip flotante al pasar el cursor */}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg border border-secondary/30 hidden sm:block">
            {propertyTitle ? 'Consultar sobre esta propiedad' : '¡Escribinos por WhatsApp!'}
          </span>
        </a>
      </aside>
    )
  }

  // Barra fija inferior para celulares en la ficha de propiedad
  if (variant === 'sticky-bar') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 sm:hidden shadow-lg flex items-center justify-between gap-3">
        <div className="truncate">
          <p className="text-xs text-gray-500 font-medium">¿Te interesa esta propiedad?</p>
          <p className="text-sm font-semibold text-primary truncate">{propertyTitle}</p>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow whitespace-nowrap active:scale-95 transition-transform"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Consultar
        </a>
      </div>
    )
  }

  // Botón estándar para tarjetas y páginas
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow text-sm active:scale-95',
        className
      )}
    >
      <WhatsAppIcon className="h-4 w-4" />
      <span>{text}</span>
    </a>
  )
}
