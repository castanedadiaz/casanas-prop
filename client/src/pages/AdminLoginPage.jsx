import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lock, Mail } from 'lucide-react'
import useAuthStore from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useSeo } from '../utils/seo'

export default function AdminLoginPage() {
  useSeo({ title: 'Acceso administración', noindex: true })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('¡Bienvenido al Panel de Administración!')
      navigate('/admin')
    } catch (err) {
      const msg = err.response?.data?.message || 'Credenciales incorrectas'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 space-y-8">
        <div className="text-center space-y-3">
          <img
            src="/logo.png"
            alt="Casañas Propiedades"
            className="h-20 w-auto mx-auto object-contain"
          />
          <h2 className="font-display text-2xl font-bold text-primary">
            Panel de Administración
          </h2>
          <p className="text-xs text-gray-500">
            Ingresá con tus credenciales para gestionar el catálogo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Correo Electrónico"
            type="email"
            icon={Mail}
            placeholder="admin@casanaspropiedades.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full shadow-lg font-bold"
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Credencial por defecto para desarrollo:{' '}
            <span className="font-mono text-gray-600 block mt-1">
              admin@casanaspropiedades.com / CasanasAdmin2024!
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

