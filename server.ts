'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, User, X, Loader2 } from 'lucide-react'
import type { Photo } from '@/app/page'

interface UploadSectionProps {
  onUploadSuccess: (photos: Photo[]) => void
}

export function UploadSection({ onUploadSuccess }: UploadSectionProps) {
  const [senderName, setSenderName] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))
    
    fileArray.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
    
    setSelectedFiles(prev => [...prev, ...fileArray])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return
    
    setIsUploading(true)
    const name = senderName.trim() || 'Convidado'
    const uploadedPhotos: Photo[] = []

    try {
      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('senderName', name)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          uploadedPhotos.push({
            id: crypto.randomUUID(),
            sender_name: name,
            blob_url: data.url,
            filename: file.name,
            created_at: new Date().toISOString(),
          })
        }
      }

      onUploadSuccess(uploadedPhotos)
      
      // Reset form
      setSelectedFiles([])
      setPreviews([])
      setSenderName('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Erro no upload:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      {/* Section Header */}
      <div className="px-6 pb-6 pt-11 text-center">
        <p className="mb-2.5 text-xs uppercase tracking-[0.25em] text-sage">
          Album coletivo
        </p>
        <h2 className="mb-2.5 font-serif text-3xl font-normal text-navy">
          Suas fotos, nossa historia
        </h2>
        <p className="mx-auto max-w-xs text-sm font-light leading-relaxed text-muted-foreground">
          Clique abaixo para enviar as fotos que voce tirou no casamento. Elas farao parte do nosso album para sempre
        </p>
      </div>

      {/* Name Input */}
      <div className="mx-5 mb-4 flex items-center gap-2.5 rounded-xl border border-border bg-card px-4">
        <User className="h-4.5 w-4.5 shrink-0 text-muted-foreground/60" />
        <input
          type="text"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Seu nome (para identificar as fotos)"
          maxLength={40}
          className="flex-1 bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          mx-5 mb-8 cursor-pointer rounded-2xl border-2 border-dashed bg-card px-6 py-10 text-center transition-all
          ${isDragOver 
            ? 'border-sage-dark bg-sage-light/10' 
            : 'border-sage-light hover:border-sage-dark hover:bg-sage-light/5'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cream">
          <Upload className="h-6 w-6 text-sage-dark" />
        </div>
        
        <p className="mb-1.5 font-serif text-lg text-navy">
          Toque para escolher fotos
        </p>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          Voce pode selecionar varias fotos de uma vez.
          <br />
          JPG, PNG ou HEIC
        </p>
        
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
          className="rounded-full bg-sage-dark px-7 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-sage"
        >
          Selecionar Fotos
        </button>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="mx-5 mb-4">
          <div className="grid grid-cols-3 gap-1.5">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute right-1 top-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-black/55 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      {selectedFiles.length > 0 && (
        <div className="mx-5 mb-10">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUploading}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-sage-dark py-4 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:bg-sage disabled:cursor-not-allowed disabled:bg-muted-foreground"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4.5 w-4.5" />
                Enviar fotos
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
