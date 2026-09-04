import collegePhoto from '@/imports/1000323337.jpg';

const foundation = [
  {
    icon: '🎯',
    title: 'Institutional Objectives',
    points: [
      'To foster a disciplined academic environment characterized by sincerity, innovation, and ethical integrity.',
      'To deliver quality education that empowers the youth of Chiplun and surrounding regions.',
      'To establish the institution as an exemplar of educational excellence in the Konkan region.',
    ],
  },
  {
    icon: '🔭',
    title: 'Vision Statement',
    points: [
      'To emerge as a renowned center of higher learning, scientific inquiry, and cultural excellence in Chiplun Taluka.',
      'To inspire intellectual curiosity, moral values, and social responsibility among all students.',
      'To groom confident students capable of meaningful contributions to society and the nation.',
    ],
  },
  {
    icon: '🎓',
    title: 'Mission Statement',
    points: [
      'To provide accessible, affordable, and high-quality collegiate education to rural and semi-urban learners.',
      'To promote research, innovation, and holistic student development.',
      'To administer institutional processes with transparency, accountability, and academic rigor.',
    ],
  },
];

const committees = [
  'National Service Scheme (NSS)',
  'Cultural & Events Committee',
  'Gymkhana & Sports Council',
  'Examination Cell',
  'Internal Quality Assurance Cell (IQAC)',
  'Anti-Ragging Squad',
  'Women Development Cell (WDC)',
  'Student Welfare & Counselling',
];

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="py-12 sm:py-16 px-4 text-white" style={{ backgroundColor: '#1e3764' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">Heritage & Governance</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
            About Our Institution
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Shriram Education Society's Shri. Anandrao Pawar Arts, Commerce and Science Mahavidyalaya, Chiplun.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* About College Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
              <span>🏛️</span> Established in 2018-19
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1e3764' }}
            >
              Shri. Anandrao Pawar Mahavidyalaya
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Shri. Anandrao Pawar Arts, Commerce and Science Mahavidyalaya, Kanganewadi, Khend, Chiplun was established in 2018-19 under the aegis of <strong>Shriram Education Society, Chiplun</strong> to provide accessible and quality higher education to students of Chiplun Taluka.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The college offers Junior College (11th & 12th) in Arts, Commerce, and Science streams approved by the <strong>Maharashtra State Board</strong>, as well as Senior College (Degree) courses affiliated to the <strong>University of Mumbai</strong> and accredited by <strong>NAAC</strong>.
            </p>

            {/* Student Enrollment Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="rounded-2xl p-5 border border-amber-200 bg-amber-50/70 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Junior College</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold">11th & 12th</span>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-[#1e3764]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
                  200
                </p>
                <p className="text-xs text-slate-700 font-semibold mt-1">Enrolled Students</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Streams: Arts, Commerce, Science</p>
              </div>

              <div className="rounded-2xl p-5 border border-amber-200 bg-amber-50/70 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Senior College</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold">Degree</span>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-[#1e3764]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
                  350
                </p>
                <p className="text-xs text-slate-700 font-semibold mt-1">Enrolled Students</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Streams: Arts, Commerce, Science</p>
              </div>
            </div>
          </div>

          {/* Campus Photo Display */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 aspect-[4/3] relative group">
              <img
                src={collegePhoto}
                alt="Shri Anandrao Pawar College Campus Building"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 img-hd"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-5">
                <span className="text-white text-xs font-semibold bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                  📍 Kanganewadi, Khend, Chiplun Campus
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Vision, Mission, Objectives */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#e07b00' }}>
              Guiding Principles
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1e3764' }}
            >
              Our Institutional Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {foundation.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 hover:shadow-lg transition-all duration-300 hover:border-amber-400 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3
                    className="font-bold text-lg sm:text-xl mb-4 text-[#1e3764]"
                    style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                  >
                    {f.title}
                  </h3>
                  <ul className="space-y-3">
                    {f.points.map((p, i) => (
                      <li key={i} className="text-slate-600 text-xs sm:text-sm leading-relaxed flex gap-2.5">
                        <span style={{ color: '#e07b00' }} className="font-bold flex-shrink-0">
                          ▸
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Co-Curricular & Student Support Committees */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2
              className="text-xl sm:text-2xl font-bold mb-1 text-[#1e3764]"
              style={{ fontFamily: 'Fraunces, Georgia, serif' }}
            >
              Co-Curricular & Student Support Committees
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Student welfare cells and activity councils supporting holistic development.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {committees.map((item) => (
              <span
                key={item}
                className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full font-medium border border-amber-200"
                style={{ backgroundColor: '#fff3e0', color: '#c06800' }}
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
