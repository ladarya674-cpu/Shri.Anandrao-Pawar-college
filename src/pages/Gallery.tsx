import { useState, useEffect } from "react"

interface GalleryItem {
  id: string
  title: string
  description: string
  filename: string
  uploadedAt: string
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/api/gallery")
        if (!res.ok) throw new Error("Failed to load gallery photos")
        setPhotos(await res.json())
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Could not load gallery.")
      } finally {
        setLoading(false)
      }
    }
    fetchPhotos()
  }, [])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const nextPhoto = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % photos.length)
  }

  const prevPhoto = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner */}
      <div
        className="py-12 sm:py-16 px-4 text-white"
        style={{ backgroundColor: "#1e3764" }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
            Visual Tour
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            Campus Photo Gallery
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Experience our academic facilities, specialized laboratories,
            seminar halls, and vibrant learning atmosphere at Chiplun.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-slate-200 border-t-[#1e3764] rounded-full mb-3" />
            <p className="text-sm font-medium">Loading photos...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">
            <span className="text-4xl block mb-2">⚠️</span>
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <span className="text-4xl block mb-2">🖼️</span>
            <p className="text-sm font-semibold text-slate-600">
              No photos available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-900">
                  <img
                    src={`/api/uploads/gallery/${photo.filename}`}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 img-hd"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white text-xl">
                      🔍
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-[#e07b00] transition-colors leading-snug"
                      style={{ fontFamily: "Fraunces, Georgia, serif" }}
                    >
                      {photo.title}
                    </h3>
                    {photo.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      {formatDateShort(photo.uploadedAt)}
                    </span>
                    <span className="text-xs text-[#1e3764] font-semibold inline-flex items-center gap-1">
                      Expand <span>↗</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black max-h-[75vh] flex items-center justify-center border border-white/20">
              <img
                src={`/api/uploads/gallery/${photos[lightboxIndex].filename}`}
                alt={photos[lightboxIndex].title}
                className="max-h-[75vh] w-auto object-contain img-hd"
              />

              {/* Prev / Next Arrows */}
              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center text-xl transition-all border border-white/20"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center text-xl transition-all border border-white/20"
                aria-label="Next photo"
              >
                ›
              </button>
            </div>

            {/* Caption & Controls */}
            <div className="w-full mt-4 flex items-start justify-between text-white px-2">
              <div className="flex-1 mr-4">
                <p
                  className="font-bold text-sm sm:text-base text-amber-300 mb-1"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  {photos[lightboxIndex].title}
                </p>
                {photos[lightboxIndex].description && (
                  <p className="text-xs text-slate-300 mb-2 max-w-2xl">
                    {photos[lightboxIndex].description}
                  </p>
                )}
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                  Photo {lightboxIndex + 1} of {photos.length} ·{" "}
                  {formatDateShort(photos[lightboxIndex].uploadedAt)}
                </p>
              </div>
              <button
                onClick={closeLightbox}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                Close (✕)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
