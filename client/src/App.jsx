import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import useAuthStore from './context/AuthContext'

// Lazy loaded pages for performance
const HomePage = lazy(() => import('./pages/HomePage'))
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'))
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'))
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminPropertiesPage = lazy(() => import('./pages/AdminPropertiesPage'))
const AdminPropertyForm = lazy(() => import('./pages/AdminPropertyForm'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Verificando sesión..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Suspense fallback={<LoadingSpinner fullScreen text="Cargando..." />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="propiedades" element={<PropertiesPage />} />
          <Route path="propiedad/:slug" element={<PropertyDetailPage />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="propiedades" element={<AdminPropertiesPage />} />
          <Route path="propiedades/nueva" element={<AdminPropertyForm />} />
          <Route path="propiedades/editar/:id" element={<AdminPropertyForm />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

