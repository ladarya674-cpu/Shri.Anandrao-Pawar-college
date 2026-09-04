import { Link } from 'react-router';
import computerLab from '@/imports/1000323348.jpg';
import library from '@/imports/1000323349.jpg';
import office from '@/imports/1000323350.jpg';
import principalCabin from '@/imports/1000323351.jpg';
import chemLab from '@/imports/1000323352.jpg';
import seminarHall from '@/imports/1000323353.jpg';
import conferenceRoom from '@/imports/1000323338.jpg';

const facilities = [
  {
    title: 'Central Knowledge Library',
    desc: 'Well-stocked library featuring thousands of reference books, textbooks, research journals, periodicals, and a dedicated silent reading hall for Junior and Senior College students.',
    img: library,
    stats: ['10,000+ Volumes', 'Spacious Reading Hall', 'Digital E-Journals', 'All Academic Streams'],
    tag: 'Academic Resource',
  },
  {
    title: 'Modern Computer Laboratory',
    desc: 'High-speed internet-connected computer laboratory with modern desktop workstations configured for IT practicals, Commerce analytics, Science projects, and digital literacy training.',
    img: computerLab,
    stats: ['Desktop Computers', 'High-Speed Broadband', 'IT Practical Sessions', 'Air-Conditioned'],
    tag: 'Information Technology',
  },
  {
    title: 'Chemistry & Science Laboratory',
    desc: 'Fully equipped science practical laboratory with high-grade chemical reagents, glassware, fume exhausts, safety equipment, and precision measurement apparatus.',
    img: chemLab,
    stats: ['Practical Workstations', 'Safety Equipment', 'Analytical Glassware', 'Faculty Supervision'],
    tag: 'Science & Research',
  },
  {
    title: 'Audio-Visual Seminar Hall',
    desc: 'Acoustically treated multi-purpose seminar hall equipped with high-resolution digital projection, sound systems, and comfortable seating for guest lectures, seminars, and student presentations.',
    img: seminarHall,
    stats: ['Digital Projector', 'Acoustic Sound System', 'Large Seating Capacity', 'Workshops & Events'],
    tag: 'Events & Lectures',
  },
  {
    title: 'Executive Conference Room',
    desc: 'Modern conference facility for faculty meetings, College Development Committee (CDC) sessions, IQAC discussions, and academic collaborations.',
    img: conferenceRoom,
    stats: ['Air Conditioned', 'Roundtable Setup', 'Faculty Meetings', 'Planning Sessions'],
    tag: 'Governance',
  },
  {
    title: 'Administrative & Student Services Office',
    desc: 'Dedicated single-window administrative office for admission processing, fee receipts, university examination forms, scholarship disbursements, and document issuing.',
    img: office,
    stats: ['Single Window Counter', 'Admissions & Fees', 'Scholarship Helpdesk', 'Certificate Verification'],
    tag: 'Student Support',
  },
  {
    title: "Principal's Cabin & Counselling Office",
    desc: "Spacious administrative chamber for institutional governance, faculty interaction, student mentoring, and parent-teacher consultations.",
    img: principalCabin,
    stats: ['Academic Governance', 'Student Mentoring', 'Parent Consultations', 'Disciplinary Guidance'],
    tag: 'Leadership',
  },
];

export default function Infrastructure() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner */}
      <div className="py-12 sm:py-16 px-4 text-white" style={{ backgroundColor: '#1e3764' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">Campus Infrastructure</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
            Facilities & Campus
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            State-of-the-art facilities designed to foster an inspiring, disciplined, and technologically equipped educational atmosphere.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#1e3764' }}
          >
            Built for Academic Excellence
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed">
            Our campus at Kanganewadi, Khend, Chiplun spans well-ventilated classrooms, high-tech laboratories, an expansive library, and student amenity zones tailored to both Higher Secondary (11th & 12th) and Undergraduate Degree programs.
          </p>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="h-52 sm:h-56 overflow-hidden relative bg-slate-900">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 img-hd"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white shadow-sm"
                    style={{ backgroundColor: '#e07b00' }}
                  >
                    {f.tag}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <h3
                    className="font-bold text-lg sm:text-xl mb-2 text-[#1e3764] group-hover:text-[#e07b00] transition-colors"
                    style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                    {f.desc}
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {f.stats.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: '#fff3e0', color: '#c06800' }}
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}

      </div>
    </div>
  );
}
