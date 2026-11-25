import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2, X } from 'lucide-react'

export default function ImageGallery({ images = [], title = 'Propiedad' }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  useEffect(() => {
    if (!isLightboxOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      else if (e.key === 'ArrowLeft' && images.length > 1) handlePrev()
      else if (e.key === 'ArrowRight' && images.length > 1) handleNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isLightboxOpen, images.length, handlePrev, handleNext])

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 sm:h-96 md:h-[450px] bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/20 rounded-2xl flex flex-col items-center justify-center text-gray-400 border border-gray-200">
        <ImageIcon className="h-16 w-16 text-primary/40 mb-2" />
        <span className="font-display font-semibold text-primary/70 text-lg">CASAÑAS PROPIEDADES</span>
        <span className="text-xs text-gray-500 mt-1">Imágenes no disponibles</span>
      </div>
    )
  }

  const currentImage = images[selectedIndex]?.url
  const fullImageUrl = currentImage
    ? currentImage.startsWith('http')
      ? currentImage
      : `http://localhost:3001${currentImage}`
    : ''

  return (
    <div className="space-y-3">
      {/* Main Large Image with Blurred Ambient Background */}
      <div className="relative w-full h-80 sm:h-[420px] md:h-[540px] bg-gray-950 rounded-2xl overflow-hidden shadow-lg group">
        {/* Blurred background layer */}
        <img
          src={fullImageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-75 select-none pointer-events-none transition-all duration-300"
        />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Foreground sharp image (never cropped) */}
        <img
          src={fullImageUrl}
          alt={`${title} - Foto ${selectedIndex + 1}`}
          onClick={() => setIsLightboxOpen(true)}
          className="relative z-10 w-full h-full object-contain select-none cursor-zoom-in transition-all duration-300 drop-shadow-2xl"
        />

        {/* Expand button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          aria-label="Ampliar imagen"
          className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/75 backdrop-blur-md text-white p-2 rounded-full transition opacity-80 group-hover:opacity-100"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>

        {/* Arrows (only if > 1 image) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/85 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-lg transition opacity-90 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/85 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-lg transition opacity-90 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => {
            const thumbUrl = img.url?.startsWith('http') ? img.url : `http://localhost:3001${img.url}`
            return (
              <button
                type="button"
                key={img.id || idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                  selectedIndex === idx
                    ? 'border-secondary ring-2 ring-secondary/30 scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={thumbUrl} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            )
          })}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Cerrar visor"
            className="absolute top-4 right-4 z-30 bg-white/15 hover:bg-white/25 text-white p-2.5 rounded-full transition"
          >
            <X className="h-6 w-6" />
          </button>

          <img
            src={fullImageUrl}
            alt={`${title} - Foto ${selectedIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain select-none rounded-lg"
          />

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev()
                }}
                aria-label="Foto anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full transition"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                aria-label="Foto siguiente"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3 rounded-full transition"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

