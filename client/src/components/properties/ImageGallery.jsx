import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'

export default function ImageGallery({ images = [], title = 'Propiedad' }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

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

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-3">
      {/* Main Large Image */}
      <div className="relative w-full h-80 sm:h-96 md:h-[480px] bg-gray-900 rounded-2xl overflow-hidden shadow-lg group">
        <img
          src={fullImageUrl}
          alt={`${title} - Foto ${selectedIndex + 1}`}
          className="w-full h-full object-cover select-none transition-all duration-300"
        />

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>

        {/* Arrows (only if > 1 image) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-lg transition opacity-90 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2.5 rounded-full shadow-lg transition opacity-90 group-hover:opacity-100"
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
    </div>
  )
}

