import { useState, useEffect } from "react"

interface NoticeItem {
  id: string

  title: string

  category: string

  important: boolean

  content: string

  filename: string | null

  originalName: string | null

  fileSize: string | null

  uploadedAt: string
}

const categories = [
  "All Notices",

  "Admission",

  "Examination",

  "Academic",

  "Events & NSS",

  "Sports",

  "Scholarship",

  "Library",
]

function formatDate(iso: string) {
  const d = new Date(iso)

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatDateTime(iso: string) {
  const d = new Date(iso)

  return d.toLocaleString("en-IN", {
    day: "2-digit",

    month: "short",

    year: "numeric",

    hour: "2-digit",

    minute: "2-digit",

    hour12: true,
  })
}

export default function Notices() {
  const [notices, setNotices] = useState<NoticeItem[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")

  const [search, setSearch] = useState("")

  const [selectedCategory, setSelectedCategory] = useState("All Notices")

  const [activeNoticeModal, setActiveNoticeModal] = useState<NoticeItem | null>(
    null,
  )

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true)

      setError("")

      try {
        const res = await fetch("/api/notices")

        if (!res.ok) throw new Error("Server returned " + res.status)

        const data = await res.json()

        setNotices(data)
      } catch (e: unknown) {
        setError(
          "Could not load notices. The backend server may not be running.",
        )

        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  const filtered = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase()) ||
      formatDate(n.uploadedAt).toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === "All Notices" || n.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div
        className="py-8 sm:py-10 px-4 text-white border-b-4 border-amber-500"
        style={{ backgroundColor: "#1e3764" }}
      >
        <div className="max-w-7xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-white/10 border border-white/20 text-orange-300">
              <span>📢</span> Official Announcements
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Notice Board
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-2xl">
              Stay updated with current circulars, academic notifications,
              examination schedules, and institutional events.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Backend Error Banner */}
        {error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
            <span className="font-bold">⚠️ </span>
            {error}
            <span className="block text-xs mt-1 text-amber-600">
              Run{" "}
              <code className="bg-amber-100 px-1 rounded font-mono">
                node backend/server.js
              </code>{" "}
              to start the backend.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left — Controls & Categories */}
          <div className="lg:col-span-4 space-y-5">
            {/* Search Box */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Search Circulars
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by keyword, date, topic..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#e07b00] focus:border-transparent transition-all"
                />
                <span className="absolute left-3.5 top-3 text-slate-400 text-sm">
                  🔍
                </span>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3
                className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3"
                style={{ color: "#1e3764" }}
              >
                Filter By Category
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isSelected
                          ? "text-white font-semibold shadow-sm"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      style={{
                        backgroundColor: isSelected ? "#1e3764" : "transparent",
                      }}
                    >
                      <span>{cat}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Admin Help Desk */}
            <div className="rounded-xl p-5 border border-amber-200 bg-amber-50/70 text-slate-800">
              <h4 className="font-bold text-sm text-[#1e3764] mb-1">
                Administrative Help Desk
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                For official circular clarification or certificate verification,
                contact the college office.
              </p>
              <div className="text-xs font-semibold text-[#e07b00]">
                📧 shriram.society@rediffmail.com
              </div>
            </div>
          </div>

          {/* Right — Notice List */}
          <div className="lg:col-span-8">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 px-1 pb-3 border-b border-slate-200">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#e07b00] mb-0.5">
                  Official updates
                </p>
                <div className="text-xs sm:text-sm font-semibold text-slate-600">
                  Official notices in{" "}
                  <span className="text-[#e07b00]">{selectedCategory}</span>
                </div>
              </div>
              {(search || selectedCategory !== "All Notices") && (
                <button
                  onClick={() => {
                    setSearch("")

                    setSelectedCategory("All Notices")
                  }}
                  className="text-xs text-[#e07b00] hover:underline font-semibold"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="animate-spin inline-block w-10 h-10 border-4 border-slate-200 border-t-[#1e3764] rounded-full mb-3" />
                <p className="text-sm font-medium text-slate-600">
                  Loading notices...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                <span className="text-5xl block mb-3">📭</span>
                <h3 className="text-base font-bold text-slate-700 mb-1">
                  No Notices Found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  No circulars matched your search query. Try different keywords
                  or select "All Notices".
                </p>
                <button
                  onClick={() => {
                    setSearch("")

                    setSelectedCategory("All Notices")
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg text-white"
                  style={{ backgroundColor: "#1e3764" }}
                >
                  View All Notices
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filtered.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setActiveNoticeModal(n)}
                    className={`bg-white border rounded-2xl p-4 sm:p-5 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col sm:flex-row items-start gap-4 ${
                      n.important
                        ? "border-amber-400 bg-gradient-to-r from-amber-50/40 via-white to-white"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Date Badge */}
                    <div
                      className="flex-shrink-0 w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex flex-col items-center justify-center text-white shadow-sm"
                      style={{
                        backgroundColor: n.important ? "#e07b00" : "#1e3764",
                      }}
                    >
                      <span className="text-sm sm:text-base font-bold leading-none">
                        {new Date(n.uploadedAt)
                          .getDate()
                          .toString()
                          .padStart(2, "0")}
                      </span>
                      <span className="text-[10px] sm:text-xs uppercase font-semibold text-amber-200 leading-none mt-1">
                        {new Date(n.uploadedAt).toLocaleString("en-IN", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-[9px] text-slate-300 leading-none mt-0.5 hidden sm:block">
                        {new Date(n.uploadedAt).getFullYear()}
                      </span>
                    </div>

                    {/* Notice Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#fff3e0",
                            color: "#c06800",
                          }}
                        >
                          {n.category}
                        </span>
                        {n.important && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1 border border-red-200">
                            <span>⚠️</span> Urgent / Important
                          </span>
                        )}
                        {n.filename && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            📄 PDF Attached
                          </span>
                        )}
                        <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
                          {n.fileSize || (n.filename ? "PDF" : "No PDF")}
                        </span>
                      </div>

                      <h3
                        className="text-sm sm:text-base font-bold text-slate-800 leading-snug group-hover:text-[#e07b00] transition-colors mb-1.5"
                        style={{ fontFamily: "Fraunces, Georgia, serif" }}
                      >
                        {n.title}
                      </h3>

                      {n.content && (
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {n.content}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-[#1e3764] font-semibold group-hover:text-[#e07b00] inline-flex items-center gap-1">
                          Read Full Notice <span>→</span>
                        </span>
                        <span className="text-slate-400">
                          {formatDate(n.uploadedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {activeNoticeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4"
          onClick={() => setActiveNoticeModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="p-5 sm:p-6 text-white flex items-start justify-between gap-4"
              style={{ backgroundColor: "#1e3764" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-slate-950">
                    {activeNoticeModal.category}
                  </span>
                  {activeNoticeModal.important && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                      Important Notice
                    </span>
                  )}
                  <span className="text-xs text-blue-200">
                    {formatDate(activeNoticeModal.uploadedAt)}
                  </span>
                </div>
                <h2
                  className="text-lg sm:text-xl font-bold leading-snug"
                  style={{ fontFamily: "Fraunces, Georgia, serif" }}
                >
                  {activeNoticeModal.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="text-white/80 hover:text-white text-2xl font-bold p-1 rounded-lg hover:bg-white/10 flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {activeNoticeModal.content && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-800 mb-2">
                    Notice Circular Summary:
                  </p>
                  <p>{activeNoticeModal.content}</p>
                </div>
              )}

              {/* Upload info */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                <p className="font-bold text-[#1e3764]">Upload Information</p>
                <p className="text-slate-600">
                  📅 Uploaded on:{" "}
                  <span className="font-semibold text-slate-800">
                    {formatDateTime(activeNoticeModal.uploadedAt)}
                  </span>
                </p>
                {activeNoticeModal.originalName && (
                  <p className="text-slate-600">
                    📄 File:{" "}
                    <span className="font-semibold text-slate-800">
                      {activeNoticeModal.originalName}
                    </span>
                    {activeNoticeModal.fileSize && (
                      <span className="text-slate-500 ml-1">
                        ({activeNoticeModal.fileSize})
                      </span>
                    )}
                  </p>
                )}
                {!activeNoticeModal.filename && (
                  <p className="text-slate-500 italic">
                    No PDF attached to this notice.
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-[#1e3764]">
                  Instructions for Students & Faculty:
                </p>
                <p>
                  • All official college communications published here are
                  signed by the Principal / Registrar.
                </p>
                <p>
                  • For physical verification or duplicate copies, visit the
                  college administrative office during working hours (9:00 AM -
                  5:00 PM).
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Doc Ref: SAP/NOT/
                {activeNoticeModal.id.slice(0, 8).toUpperCase()}/2026
              </span>
              <div className="flex gap-2">
                {activeNoticeModal.filename ? (
                  <a
                    href={`/api/uploads/${activeNoticeModal.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-colors"
                    style={{ backgroundColor: "#e07b00" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#c06800")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e07b00")
                    }
                  >
                    <span>📥</span> Download PDF
                  </a>
                ) : (
                  <span className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 bg-slate-200 flex items-center gap-1.5 cursor-not-allowed">
                    <span>📄</span> No PDF Available
                  </span>
                )}
                <button
                  onClick={() => setActiveNoticeModal(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
