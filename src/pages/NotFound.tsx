import { Link } from "react-router"

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-slate-50">
      <div className="w-20 h-20 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl mb-6 shadow-inner">
        🔍
      </div>
      <p
        className="text-6xl sm:text-7xl font-bold mb-3"
        style={{ color: "#1e3764", fontFamily: "Fraunces, Georgia, serif" }}
      >
        404
      </p>
      <h1
        className="text-xl sm:text-2xl font-bold mb-2"
        style={{ color: "#1e3764", fontFamily: "Fraunces, Georgia, serif" }}
      >
        Page Not Found
      </h1>
      <p className="text-slate-500 text-xs sm:text-sm mb-8 max-w-md mx-auto leading-relaxed">
        The requested page or circular could not be found. It may have been
        relocated or updated.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="px-6 py-3 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-md"
          style={{ backgroundColor: "#e07b00" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#c06800")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#e07b00")
          }
        >
          ← Return to Home
        </Link>
        <Link
          to="/notices"
          className="px-6 py-3 font-semibold rounded-xl text-xs sm:text-sm border-2 transition-colors bg-white hover:bg-slate-50"
          style={{ borderColor: "#1e3764", color: "#1e3764" }}
        >
          View Notice Board
        </Link>
      </div>
    </div>
  )
}
