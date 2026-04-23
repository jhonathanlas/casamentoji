'use client'

import { useState, useEffect, useCallback } from 'react'
import { HeroSection } from '@/components/wedding/hero-section'
import { CountdownSection } from '@/components/wedding/countdown-section'
import { UploadSection } from '@/components/wedding/upload-section'
import { GallerySection } from '@/components/wedding/gallery-section'
import { FooterSection } from '@/components/wedding/footer-section'
import { Toast } from '@/components/wedding/toast'

export interface Photo {
  id: string
  sender_name: string
  blob_url: string
  filename: string
  created_at: string
}

export default function WeddingPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch('/api/photos')
      const data = await response.json()
      if (data.photos) {
        setPhotos(data.photos)
      }
    } catch (error) {
      console.error('Erro ao buscar fotos:', error)
    }
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  const handleUploadSuccess = (newPhotos: Photo[]) => {
    setPhotos(prev => [...newPhotos, ...prev])
    showToastMessage('Fotos enviadas com sucesso!')
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3500)
  }

  return (
    <main className="min-h-screen bg-cream">
      <HeroSection />
      <CountdownSection />
      <UploadSection onUploadSuccess={handleUploadSuccess} />
      <GallerySection photos={photos} />
      <FooterSection />
      <Toast message={toastMessage} show={showToast} />
    </main>
  )
}
