import React from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X, Star } from 'lucide-react'

export default function ImageUploader({
  files = [],
  setFiles,
  existingImages = [],
  onDeleteExisting,
  maxFiles = 15,
}) {
  const onDrop = (acceptedFiles) => {
    const totalCurrent = files.length + existingImages.length
    const remaining = maxFiles - totalCurrent
    const newFiles = acceptedFiles.slice(0, remaining).map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    )
    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeNewFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
  })

  const totalImages = files.length + existingImages.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium">Imágenes ({totalImages}/{maxFiles})</span>
        <span>Máx 5MB por imagen (JPG, PNG, WebP)</span>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-secondary bg-secondary/10'
            : 'border-gray-300 hover:border-primary bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-10 w-10 text-secondary-dark mx-auto mb-2" />
        <p className="text-sm font-semibold text-gray-700">
          {isDragActive
            ? 'Soltá las imágenes acá...'
            : 'Hacé clic o arrastrá las fotos de la propiedad acá'}
        </p>
        <p className="text-xs text-gray-400 mt-1">La primera imagen será la foto de portada</p>
      </div>

      {/* Grid of images preview */}
      {totalImages > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
          {/* Existing images */}
          {existingImages.map((img) => {
            const imgUrl = img.url?.startsWith('http') ? img.url : `http://localhost:3001${img.url}`
            return (
              <div key={img.id} className="relative group rounded-xl overflow-hidden h-24 bg-gray-100 border border-gray-200">
                <img src={imgUrl} alt="Existente" className="w-full h-full object-cover" />
                {img.isCover && (
                  <span className="absolute top-1 left-1 bg-secondary text-primary text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                    <Star className="h-2.5 w-2.5 fill-current" /> Portada
                  </span>
                )}
                {onDeleteExisting && (
                  <button
                    type="button"
                    onClick={() => onDeleteExisting(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition shadow"
                    title="Eliminar imagen"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )
          })}

          {/* New files to upload */}
          {files.map((file, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden h-24 bg-gray-100 border border-gray-200">
              <img src={file.preview} alt="Nueva" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition shadow"
                title="Quitar"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

