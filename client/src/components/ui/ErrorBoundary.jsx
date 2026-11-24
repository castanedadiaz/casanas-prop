import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF8F2] text-gray-800 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-gray-200 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold text-[#1A3C2A]">Algo salió mal</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ocurrió un error inesperado al renderizar la página.
            </p>
            {this.state.error && (
              <pre className="text-xs bg-gray-100 p-3 rounded-lg text-left overflow-x-auto text-red-700">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/'
              }}
              className="bg-[#1A3C2A] hover:bg-[#2D5A3F] text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition shadow"
            >
              Reintentar / Ir al Inicio
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

