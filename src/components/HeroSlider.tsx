import { useState, useEffect, useRef } from "react"

import { Link } from "react-router"

import buildingPhoto from "@/imports/1000323337.jpg"

import computerLabPhoto from "@/imports/1000323348.jpg"

import libraryPhoto from "@/imports/1000323349.jpg"

import chemLabPhoto from "@/imports/1000323352.jpg"

import seminarHallPhoto from "@/imports/1000323353.jpg"

import conferencePhoto from "@/imports/1000323338.jpg"

interface Slide {
  id: number

  image: string

  tag: string

  title: string

  description: string

  linkText?: string

  linkTo?: string
}

const slides: Slide[] = [
  {
    id: 1,

    image: buildingPhoto,

    tag: "Campus Infrastructure",

    title: "Main College Campus",

    description:
      "Modern educational campus located at Kanganewadi, Khend, Chiplun providing holistic education.",

    linkTo: "/about",
  },

  {
    id: 2,

    image: computerLabPhoto,

    tag: "Digital Learning",

    title: "Advanced Computer Laboratory",

    description:
      "High-speed internet enabled computing center for IT practicals, digital literacy, and technical projects.",

    linkTo: "/infrastructure",
  },

  {
    id: 3,

    image: libraryPhoto,

    tag: "Knowledge Resource",

    title: "Central Library & Reading Hall",

    description:
      "Rich repository of reference volumes, textbooks, national journals, and dedicated quiet study spaces.",

    linkTo: "/infrastructure",
  },

  {
    id: 4,

    image: chemLabPhoto,

    tag: "Scientific Research",

    title: "State-of-the-Art Chemistry Lab",

    description:
      "Equipped with modern apparatus, safety standards, and analytical tools for hands-on scientific training.",

    linkTo: "/academics",
  },

  {
    id: 5,

    image: seminarHallPhoto,

    tag: "Academic Events",

    title: "Audio-Visual Seminar Hall",

    description:
      "Acoustically designed auditorium with digital projection for seminars, guest lectures, and cultural events.",

    linkTo: "/infrastructure",
  },

  {
    id: 6,

    image: conferencePhoto,

    tag: "Academic Governance",

    title: "Executive Conference Room",

    description:
      "Modern venue for faculty development, board deliberations, and academic planning sessions.",

    linkTo: "/about",
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  const [isPaused, setIsPaused] = useState(false)

  const touchStartX = useRef<number | null>(null)

  const touchEndX = useRef<number | null>(null)

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(timer)
  }, [current, isPaused])

  // Touch swipe support for mobile

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current

    if (distance > 50) {
      nextSlide()
    } else if (distance < -50) {
      prevSlide()
    }

    touchStartX.current = null

    touchEndX.current = null
  }

  return (
    <div className="bg-slate-900 py-3 sm:py-5 px-2 sm:px-4">
      <div
        className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 shadow-2xl border border-slate-800 select-none group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Campus Photo Slideshow"
      >
        {/* Slides Viewport - HD Crisp Proportional Rendering */}
        <div className="relative w-full h-[260px] sm:h-[360px] md:h-[460px] lg:h-[520px] xl:h-[560px]">
          {slides.map((slide, index) => {
            const isActive = index === current

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Ambient Blurred Background to fill widescreen borders elegantly */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={slide.image}
                    alt=""
                    className="w-full h-full object-cover blur-xl scale-110 opacity-30"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-slate-950/40" />
                </div>

                {/* Primary HD Photo Display */}
                <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg sm:rounded-xl transition-transform duration-500 img-hd ${
                      isActive ? "scale-100" : "scale-98"
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>

                {/* Gentle bottom-up gradient for caption legibility */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(13, 36, 68, 0.92) 0%, rgba(13, 36, 68, 0.45) 25%, rgba(0, 0, 0, 0) 55%)",
                  }}
                />

                {/* Slide Floating Caption Card */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-5 md:p-6 lg:p-8">
                  <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div className="max-w-2xl text-white">
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold mb-1.5 shadow-sm"
                        style={{
                          backgroundColor: "rgba(224, 123, 0, 0.95)",
                          color: "#ffffff",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-200 animate-pulse" />
                        {slide.tag}
                      </div>
                      <h2
                        className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight text-white drop-shadow-md mb-1"
                        style={{ fontFamily: "Fraunces, Georgia, serif" }}
                      >
                        {slide.title}
                      </h2>
                      <p className="text-gray-200 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none max-w-xl drop-shadow">
                        {slide.description}
                      </p>
                    </div>

                    {slide.linkTo && (
                      <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                        <Link
                          to={slide.linkTo}
                          className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1.5 text-white"
                          style={{ backgroundColor: "#e07b00" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#c06800")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#e07b00")
                          }
                        >
                          <span>{slide.linkText}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 opacity-90 hover:opacity-100 hover:scale-105 shadow-lg"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 opacity-90 hover:opacity-100 hover:scale-105 shadow-lg"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Slide Counter Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-white text-[11px] sm:text-xs font-mono shadow-md">
          <span className="font-bold text-amber-400">0{current + 1}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-300">0{slides.length}</span>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-6 z-30 flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 sm:w-8 bg-amber-400"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
