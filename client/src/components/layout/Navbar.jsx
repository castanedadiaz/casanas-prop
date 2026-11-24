import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Instagram } from 'lucide-react'
import { INSTAGRAM_URL } from '../../utils/constants'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Propiedades', path: '/propiedades' },
    { name: 'En Venta', path: '/propiedades?operationType=SALE' },
    { name: 'En Alquiler', path: '/propiedades?operationType=RENT' },
    { name: 'Quiénes Somos', path: '/#nosotros' },
  ]

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/' && !location.hash) return true
    if (path === '/#nosotros' && location.hash === '#nosotros') return true
    if (path !== '/' && (location.pathname + location.search) === path) return true
    if (path === '/propiedades' && location.pathname === '/propiedades' && !location.search) return true
    return false
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 border-b border-gray-100 ${
        isScrolled
          ? 'shadow-md py-2'
          : 'shadow-sm py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group py-0.5" aria-label="Casañas Propiedades - Inicio">
            <img
              src="/logo.png"
              alt="Casañas Propiedades"
              className="h-12 sm:h-14 md:h-15 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-secondary-dark relative py-1 ${
                  isActive(link.path)
                    ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-secondary'
                    : 'text-gray-700'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Redes Sociales */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Casañas Propiedades"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#E4405F] transition rounded-lg hover:bg-gray-100 border border-gray-200"
              title="Seguinos en Instagram"
            >
              <Instagram className="h-4 w-4 text-[#E4405F]" />
              <span>@casanaspropiedades</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-primary hover:bg-gray-100 transition"
              aria-label="Abrir menú"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-primary/5 text-primary font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-[#E4405F] transition font-medium"
              >
                <Instagram className="h-4 w-4 text-[#E4405F]" />
                <span>Instagram @casanaspropiedades</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

