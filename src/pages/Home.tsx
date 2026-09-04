import { Link } from 'react-router';
import HeroSlider from '@/components/HeroSlider';
import computerLabPhoto from '@/imports/1000323348.jpg';
import libraryPhoto from '@/imports/1000323349.jpg';
import chemLabPhoto from '@/imports/1000323352.jpg';
import seminarHallPhoto from '@/imports/1000323353.jpg';

const stats = [
  { value: '550+', label: 'Enrolled Students', icon: '👨‍🎓' },
  { value: '2018', label: 'Year Established', icon: '🏛️' },
  { value: '6+', label: 'Academic Programs', icon: '📚' },
  { value: 'Grade A', label: 'NAAC Accredited', icon: '⭐' },
];

const notices = [
  { id: 1, date: '10 Aug 2026', title: 'Admission 2026-27: Registrations open for 11th & Degree courses', category: 'Admission', important: true },
  { id: 2, date: '05 Aug 2026', title: 'Internal Examination Schedule — October 2026', category: 'Examination', important: true },
  { id: 3, date: '01 Aug 2026', title: 'NSS Annual Camp registration open for all students', category: 'Events', important: false },
  { id: 4, date: '28 Jul 2026', title: 'Sports Day 2026 — Registration form available', category: 'Sports', important: false },
  { id: 5, date: '22 Jul 2026', title: 'Library membership renewal for new academic year', category: 'Library', important: false },
];

export default function Home() {
  return (
    <div className="bg-slate-50 text-slate-800">
      {/* 1. Dynamic Campus Photo Slideshow */}
      <section>
        <HeroSlider />
      </section>

      {/* 2. Welcome & Institutional Overview */}
      <section className="py-10 sm:py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* Left Column: Welcome Text */}
            <div className="lg:col-span-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-orange-200"
                style={{ backgroundColor: '#fff3e0', color: '#c06800' }}
              >
                <span>🏛️</span> Shriram Education Society's
              </div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3"
                style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1e3764' }}
              >
                Shri. Anandrao Pawar Arts, Commerce & Science Mahavidyalaya
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-3">
                Established in 2018-19, Shri. Anandrao Pawar College is a premier institution in Chiplun Taluka dedicated to academic excellence, disciplined education, and rural empowerment in the Konkan region.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Affiliated with the prestigious <strong>University of Mumbai</strong> and accredited with <strong>NAAC 'A' Grade</strong>, the college offers comprehensive curricula across Arts, Commerce, and Science disciplines for both Junior College and Undergraduate degrees.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/academics"
                  className="px-5 py-2.5 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all shadow-sm hover:shadow flex items-center gap-2"
                  style={{ backgroundColor: '#e07b00' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c06800')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e07b00')}
                >
                  <span>Academic Programs</span>
                  <span>→</span>
                </Link>
                <Link
                  to="/about"
                  className="px-5 py-2.5 font-semibold rounded-lg text-xs sm:text-sm border-2 transition-all hover:bg-slate-50"
                  style={{ borderColor: '#1e3764', color: '#1e3764' }}
                >
                  About the College
                </Link>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 font-semibold rounded-lg text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Right Column: Resized Compact Institutional Accreditations Card */}
            <div className="lg:col-span-4">
              <div
                className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg border border-white/10"
                style={{ background: 'linear-gradient(145deg, #1e3764 0%, #0d2444 100%)' }}
              >
                <h3
                  className="text-base font-bold mb-3 flex items-center gap-2 text-amber-300"
                  style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                >
                  <span>🏅</span> Institutional Accreditations
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-2.5 border border-white/10">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-amber-400 text-slate-900 flex-shrink-0">
                      A
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-white">NAAC 'A' Accredited</h4>
                      <p className="text-[11px] text-blue-100 truncate">Rigorous academic standards</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-2.5 border border-white/10">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] bg-blue-500 text-white flex-shrink-0">
                      MU
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-white">University of Mumbai</h4>
                      <p className="text-[11px] text-blue-100 truncate">Affiliated for B.A., B.Com & B.Sc.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 rounded-xl p-2.5 border border-white/10">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] bg-orange-500 text-white flex-shrink-0">
                      MSB
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-white">Maharashtra State Board</h4>
                      <p className="text-[11px] text-blue-100 truncate">Approved Junior College (11th & 12th)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-amber-200 font-medium">
                  <span>📍 Chiplun, Ratnagiri</span>
                  <span>Est. 2018</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Stats Counter Bar */}
      <div style={{ backgroundColor: '#1e3764' }} className="border-y border-amber-500/40">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-2xl sm:text-3xl mb-1">{s.icon}</div>
                <div
                  className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
                  style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#f9a825' }}
                >
                  {s.value}
                </div>
                <div className="text-blue-100 text-xs sm:text-sm font-medium mt-1 uppercase tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Principal's Message & Notice Board Section */}
      <section className="py-12 sm:py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* Principal's Message */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-6 rounded-full" style={{ backgroundColor: '#e07b00' }} />
                  <h2
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1e3764' }}
                  >
                    Principal's Desk
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-start my-4">
                  {/* Dignified Principal Academic Badge / Portrait Frame */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-amber-300 p-2 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                      <div className="w-16 h-16 rounded-full bg-[#1e3764] text-amber-300 flex items-center justify-center text-2xl font-bold shadow mb-2">
                        🎓
                      </div>
                      <span className="text-xs font-bold text-[#1e3764]">Office of the</span>
                      <span className="text-xs font-semibold text-slate-600">Principal</span>
                      <span className="text-[10px] text-amber-700 mt-1 font-medium bg-amber-100 px-2 py-0.5 rounded-full">
                        S.A.P. College
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
                    <p className="italic text-slate-700 bg-amber-50/60 p-3 rounded-xl border-l-4 border-amber-500">
                      "Education is not merely the accumulation of facts; it is the ignition of intellect, character building, and social responsibility."
                    </p>
                    <p>
                      Welcome to Shri. Anandrao Pawar Arts, Commerce and Science Mahavidyalaya, Kanganewadi, Khend, Chiplun. Under the visionary stewardship of <strong>Shriram Education Society</strong>, our institution has been fostering student potential since 2018.
                    </p>
                    <p>
                      We strive to create an academic environment embedded with sincerity, discipline, and modern pedagogical rigor, ensuring that our students excel in University examinations, competitive arenas, and societal leadership.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#1e3764]">Principal</h4>
                  <p className="text-xs text-slate-500">Shri. Anandrao Pawar Mahavidyalaya, Chiplun</p>
                </div>
                <Link
                  to="/about"
                  className="text-xs font-semibold text-[#e07b00] hover:text-[#c06800] flex items-center gap-1"
                >
                  Read More <span>→</span>
                </Link>
              </div>
            </div>

            {/* Unified Themed Notice Board Widget */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                {/* Notice Header */}
                <div className="px-5 py-4 flex items-center justify-between text-white" style={{ backgroundColor: '#1e3764' }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-amber-400 text-lg">📌</span>
                    <div>
                      <h3 className="font-bold text-base tracking-wide" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
                        Notice Board
                      </h3>
                      <p className="text-[11px] text-blue-200">Official Circulars & Announcements</p>
                    </div>
                  </div>
                  <Link
                    to="/notices"
                    className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm"
                  >
                    View All →
                  </Link>
                </div>

                {/* Notices List */}
                <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[380px]">
                  {notices.map((n) => (
                    <Link
                      key={n.id}
                      to="/notices"
                      className="p-4 hover:bg-amber-50/50 transition-colors flex items-start gap-3.5 group block"
                    >
                      {/* Date Badge */}
                      <div
                        className="flex-shrink-0 w-11 h-12 rounded-xl flex flex-col items-center justify-center text-white text-center shadow-sm"
                        style={{ backgroundColor: n.important ? '#e07b00' : '#1e3764' }}
                      >
                        <span className="text-xs font-bold leading-none">{n.date.split(' ')[0]}</span>
                        <span className="text-[9px] uppercase font-semibold text-amber-200 leading-none mt-1">
                          {n.date.split(' ')[1]}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#fff3e0', color: '#c06800' }}
                          >
                            {n.category}
                          </span>
                          {n.important && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              Important
                            </span>
                          )}
                        </div>
                        <p className="text-slate-800 text-xs sm:text-sm font-medium leading-snug group-hover:text-[#e07b00] transition-colors line-clamp-2">
                          {n.title}
                        </p>
                      </div>

                      <span className="text-slate-400 group-hover:text-[#e07b00] group-hover:translate-x-0.5 transition-all text-sm mt-2 flex-shrink-0">
                        ›
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Notice Footer Link */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <Link
                    to="/notices"
                    className="text-xs font-semibold text-[#1e3764] hover:text-[#e07b00] transition-colors inline-flex items-center gap-1"
                  >
                    Browse all historical circulars & notifications →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Campus Infrastructure Preview */}
      <section className="py-12 sm:py-16 px-4 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#e07b00' }}>
                Campus & Facilities
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1e3764' }}
              >
                World-Class Learning Infrastructure
              </h2>
            </div>
            <Link
              to="/infrastructure"
              className="text-xs sm:text-sm font-semibold text-[#e07b00] hover:text-[#c06800] flex items-center gap-1"
            >
              View All Facilities <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: libraryPhoto, title: 'Knowledge Library', tag: 'Reading Hall & Books' },
              { img: computerLabPhoto, title: 'Computer Laboratory', tag: 'High Speed Desktops' },
              { img: chemLabPhoto, title: 'Chemistry Laboratory', tag: 'Science Practical' },
              { img: seminarHallPhoto, title: 'Seminar Hall', tag: 'Digital Audio-Visual' },
            ].map((facility) => (
              <div
                key={facility.title}
                className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={facility.img}
                    alt={facility.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 img-hd"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
                    {facility.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h4
                    className="font-bold text-sm sm:text-base text-[#1e3764]"
                    style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                  >
                    {facility.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
