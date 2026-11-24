import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
  User,
  KeyRound,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../../context/AuthContext'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import api from '../../services/api'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  // Estado del formulario de credenciales
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  })

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleOpenProfile = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
    })
    setProfileModalOpen(true)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/auth/profile', formData)
      toast.success(res.data.message || 'Credenciales actualizadas')
      setProfileModalOpen(false)
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar credenciales'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Propiedades', path: '/admin/propiedades', icon: Building2 },
    { name: 'Nueva Propiedad', path: '/admin/propiedades/nueva', icon: PlusCircle },
  ]

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain bg-white rounded p-0.5 border border-secondary" />
          <span className="font-display font-bold text-sm">CASAÑAS ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded text-white hover:bg-primary-light"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary text-white flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-4 border-b border-primary-light/50">
            <div className="bg-white p-2.5 rounded-xl shadow-sm">
              <img
                src="/logo.png"
                alt="Casañas Propiedades"
                className="h-10 w-auto mx-auto object-contain"
              />
            </div>
            <p className="text-[10px] text-center uppercase tracking-widest text-secondary font-semibold mt-2">
              Panel de Control
            </p>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-secondary text-primary font-semibold shadow'
                      : 'text-gray-300 hover:bg-primary-light hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </Link>
              )
            })}

            <div className="pt-4 mt-4 border-t border-primary-light/30 space-y-1.5">
              <button
                type="button"
                onClick={handleOpenProfile}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-primary-light hover:text-white transition"
              >
                <KeyRound className="h-4 w-4 shrink-0 text-secondary" />
                Cambiar Contraseña
              </button>

              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-primary-light hover:text-white transition"
              >
                <ExternalLink className="h-4 w-4 shrink-0 text-secondary" />
                Ver Sitio Web
              </Link>
            </div>
          </nav>
        </div>

        {/* User & Logout */}
        <div className="p-4 border-t border-primary-light/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrador'}</p>
              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold py-2 px-3 rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>

      {/* Modal para cambiar credenciales */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Actualizar Credenciales de Administrador"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Administrador"
            required
          />

          <Input
            label="Correo Electrónico"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="admin@casanaspropiedades.com"
            required
          />

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Cambio de Contraseña (Opcional)
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Déjalo en blanco si solo deseas cambiar tu nombre o correo.
            </p>

            <div className="space-y-3">
              <Input
                label="Contraseña Actual"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="Ingresa tu clave actual"
              />

              <Input
                label="Nueva Contraseña (mínimo 8 caracteres)"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Ingresa tu nueva clave segura"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setProfileModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
