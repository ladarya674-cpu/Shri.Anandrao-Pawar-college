import { useState } from 'react';
import collegeBuilding from '@/imports/1000323337.jpg';
import conferenceRoom from '@/imports/1000323338.jpg';
import computerLab from '@/imports/1000323348.jpg';
import library from '@/imports/1000323349.jpg';
import office from '@/imports/1000323350.jpg';
import principalCabin from '@/imports/1000323351.jpg';
import chemLab from '@/imports/1000323352.jpg';
import seminarHall from '@/imports/1000323353.jpg';

const photos = [
  { id: 1, src: collegeBuilding, alt: 'College Main Campus & Building', category: 'Campus' },
  { id: 2, src: library, alt: 'Central Knowledge Library & Reading Hall', category: 'Library' },
  { id: 3, src: computerLab, alt: 'Advanced Computer Laboratory', category: 'Laboratories' },
  { id: 4, src: chemLab, alt: 'Chemistry & Science Laboratory', category: 'Laboratories' },
  { id: 5, src: seminarHall, alt: 'Audio-Visual Seminar Hall', category: 'Halls & Events' },
  { id: 6, src: conferenceRoom, alt: 'Executive Conference Room', category: 'Campus' },
  { id: 7, src: office, alt: 'Administrative & Student Services Office', category: 'Campus' },
  { id: 8, src: principalCabin, alt: "Principal's Cabin & Counselling Office", category: 'Campus' },
];

const categories = ['All Photos', 'Campus', 'Laboratories', 'Library', 'Halls & Events'];

export default function Gallery() {
  const [selectedCat, setSelectedCat] = useState('All Photos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = photos.filter((p) =>
    selectedCat === 'All Photos' ? true : p.category === selectedCat
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
  };

  const prevPhoto = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner */}
      <div className="py-12 sm:py-16 px-4 text-white" style={{ backgroundColor: '#1e3764' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">Visual Tour</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
            Campus Photo Gallery
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Experience our academic facilities, specialized laboratories, seminar halls, and vibrant learning atmosphere at Chiplun.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${selectedCat === cat
                  ? 'text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              style={selectedCat === cat ? { backgroundColor: '#1e3764' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-900">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 img-hd"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white text-xl">
                    🔍
                  </div>
                </div>
                <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-950/60 backdrop-blur-md text-amber-300 border border-white/10">
                  {photo.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3
                  className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-[#e07b00] transition-colors leading-snug"
                  style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                >
                  {photo.alt}
                </h3>
                <span className="text-xs text-[#1e3764] font-semibold mt-2 inline-flex items-center gap-1">
                  Click to Expand <span>↗</span>
                </span>
              </div>
            </div>
          ))}
        </div>
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
                src={filteredPhotos[lightboxIndex].src}
                alt={filteredPhotos[lightboxIndex].alt}
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
            <div className="w-full mt-4 flex items-center justify-between text-white px-2">
              <div>
                <p className="font-bold text-sm sm:text-base text-amber-300" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
                  {filteredPhotos[lightboxIndex].alt}
                </p>
                <p className="text-xs text-slate-400">
                  Photo {lightboxIndex + 1} of {filteredPhotos.length} · {filteredPhotos[lightboxIndex].category}
                </p>
              </div>
              <button
                onClick={closeLightbox}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
              >
                Close (✕)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
