import { Link } from "react-router"

const juniorStreams = [
  {
    stream: "Arts Stream",

    classes: ["11th Arts", "12th Arts"],

    info: "Comprehensive curriculum under Maharashtra State Board.",

    itAvailable: false,
  },

  {
    stream: "Commerce Stream",

    classes: ["11th Commerce", "12th Commerce"],

    info: "Commerce education with Information Technology (IT) option.",

    itAvailable: true,
  },

  {
    stream: "Science Stream",

    classes: ["11th Science", "12th Science"],

    info: "Science foundation with Information Technology (IT) option and laboratory practicals.",

    itAvailable: true,
  },
]

const seniorDegrees = [
  {
    title: "Bachelor in Arts (B.A.)",

    stream: "Arts Stream",

    duration: "3 Years (Undergraduate Degree)",

    affiliation: "Affiliated to University of Mumbai",

    description:
      "Undergraduate degree program in Arts stream offering foundational and specialized coursework in humanities and social sciences.",
  },

  {
    title: "Bachelor in Commerce (B.Com)",

    stream: "Commerce Stream",

    duration: "3 Years (Undergraduate Degree)",

    affiliation: "Affiliated to University of Mumbai",

    description:
      "Undergraduate degree program in Commerce providing comprehensive education in accounting, business, finance, and trade.",
  },

  {
    title: "Bachelor in Science (B.Sc.)",

    stream: "Science Stream",

    duration: "3 Years (Undergraduate Degree)",

    affiliation: "Affiliated to University of Mumbai",

    description:
      "Undergraduate degree program in Science emphasizing scientific theory, laboratory experiments, and practical applications.",
  },
]

const academicDepartments = [
  {
    faculty: "Faculty of Arts",

    icon: "📚",

    subjects: [
      "Marathi",
      "English",
      "History",
      "Economics",
      "Geography",
      "Political Science",
    ],
  },

  {
    faculty: "Faculty of Commerce",

    icon: "📊",

    subjects: [
      "Accountancy & Financial Management",
      "Commerce",
      "Business Economics",
      "Business Communication",
      "Information Technology (IT)",
    ],
  },

  {
    faculty: "Faculty of Science",

    icon: "🔬",

    subjects: [
      "Chemistry",
      "Physics",
      "Mathematics",
      "Biology",
      "Information Technology (IT)",
    ],
  },
]

export default function Academics() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Banner */}
      <div
        className="py-12 sm:py-16 px-4 text-white"
        style={{ backgroundColor: "#1e3764" }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
            Courses & Programs
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "Fraunces, Georgia, serif" }}
          >
            Academics
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Higher Secondary (Junior College) and Undergraduate Degree education
            across Arts, Commerce, and Science streams.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10 sm:space-y-12">
        {/* 1. Junior College Section */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div
            className="p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{ backgroundColor: "#1e3764" }}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                Higher Secondary (11th & 12th)
              </span>
              <h2
                className="font-bold text-lg sm:text-xl"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                Shri. Anandrao Pawar Junior College
              </h2>
              <p className="text-blue-200 text-xs mt-0.5">
                Approved by Maharashtra State Board
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow-sm">
                200 Students Enrolled
              </span>
            </div>
          </div>

          {/* Junior College Streams Grid */}
          <div className="p-5 sm:p-6">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Available Streams:{" "}
                <span className="text-[#1e3764]">Arts, Commerce, Science</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {juniorStreams.map((item) => (
                <div
                  key={item.stream}
                  className="rounded-xl border border-slate-200 p-5 bg-slate-50 flex flex-col justify-between"
                >
                  <div>
                    <h3
                      className="font-bold text-base text-[#1e3764] mb-2"
                      style={{ fontFamily: "Fraunces, Georgia, serif" }}
                    >
                      {item.stream}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.classes.map((c) => (
                        <span
                          key={c}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed mb-3">
                      {item.info}
                    </p>
                  </div>
                  {item.itAvailable && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-amber-800 bg-amber-100 border border-amber-200 inline-block">
                        ★ IT Subject Available
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Senior College (Degree) Section */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div
            className="p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{ backgroundColor: "#2a4d8f" }}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                Undergraduate Degree Programs
              </span>
              <h2
                className="font-bold text-lg sm:text-xl"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                Shri. Anandrao Pawar Arts, Commerce, Science Mahavidyalaya
              </h2>
              <p className="text-blue-100 text-xs mt-0.5">
                Affiliated to University of Mumbai · NAAC Accredited
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white font-semibold text-xs">
                350 Students Enrolled
              </span>
            </div>
          </div>

          {/* Senior College Degree Programs */}
          <div className="p-5 sm:p-6">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Available Streams:{" "}
                <span className="text-[#1e3764]">Arts, Commerce, Science</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {seniorDegrees.map((deg) => (
                <div
                  key={deg.title}
                  className="rounded-xl border border-slate-200 p-5 bg-slate-50 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 mb-2 inline-block">
                      {deg.stream}
                    </span>
                    <h3
                      className="font-bold text-base sm:text-lg text-[#1e3764] mb-1"
                      style={{ fontFamily: "Fraunces, Georgia, serif" }}
                    >
                      {deg.title}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 mb-2">
                      {deg.duration}
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {deg.description}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                    ✓ {deg.affiliation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Academic Departments & Faculties (Moved from About page) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: "#e07b00" }}
            >
              Academic Structure
            </p>
            <h2
              className="text-xl sm:text-2xl font-bold text-[#1e3764]"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Academic Faculties & Subject Disciplines
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curriculum disciplines offered across Arts, Commerce, and Science
              faculties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {academicDepartments.map((dept) => (
              <div
                key={dept.faculty}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                  <span className="text-2xl">{dept.icon}</span>
                  <h3
                    className="font-bold text-sm sm:text-base text-[#1e3764]"
                    style={{ fontFamily: "Fraunces, Georgia, serif" }}
                  >
                    {dept.faculty}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dept.subjects.map((sub) => (
                    <span
                      key={sub}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: "#fff3e0", color: "#c06800" }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Admission Inquiry Callout */}
      </div>
    </div>
  )
}
