import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import Button from '../components/ui/Button'
import { useSeo } from '../utils/seo'

export default function NotFoundPage() {
  useSeo({ title: 'Página no encontrada', noindex: true })
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="h-20 w-20 rounded-full bg-secondary/15 flex items-center justify-center text-secondary-dark">
        <Home className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary">404</h1>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-gray-800">
          Página no encontrada
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          La dirección que ingresaste no existe o la propiedad fue reubicada en nuestro catálogo.
        </p>
      </div>

      <Link to="/">
        <Button variant="primary" size="lg">
          Volver a la Página Principal
        </Button>
      </Link>
    </div>
  )
}

