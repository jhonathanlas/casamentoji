import type { Photo } from '@/app/page'

interface GallerySectionProps {
  photos: Photo[]
}

export function GallerySection({ photos }: GallerySectionProps) {
  return (
    <div>
      {/* Section Header */}
      <div className="px-6 pb-6 pt-11 text-center">
        <p className="mb-2.5 text-xs uppercase tracking-[0.25em] text-sage">
          Galeria
        </p>
        <h2 className="font-serif text-3xl font-normal text-navy">
          Momentos compartilhados
        </h2>
      </div>

      {/* Gallery Grid */}
      <div className="px-5 pb-16">
        {photos.length === 0 ? (
          <p className="py-10 text-center text-sm italic text-muted-foreground">
            As primeiras fotos aparecerao aqui
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo) => (
              <GalleryCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GalleryCard({ photo }: { photo: Photo }) {
  const initials = photo.sender_name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="animate-fade-up overflow-hidden rounded-xl bg-card shadow-sm">
      <img
        src={photo.blob_url}
        alt={`Foto de ${photo.sender_name}`}
        className="aspect-square w-full object-cover"
      />
      <div className="flex items-center gap-1.5 px-2.5 py-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-[10px] font-semibold text-white">
          {initials}
        </div>
        <span className="truncate text-xs text-muted-foreground">
          {photo.sender_name}
        </span>
      </div>
    </div>
  )
}
