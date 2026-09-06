import { Link } from "react-router"

import logo from "@/imports/1000323357.jpg"

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#0d2444" }}
      className="text-slate-300 border-t-4 border-amber-500"
    >
      <div className="max-w-7xl mx-auto px-4 py-9 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Column 1: College Emblem & Overview */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="College Emblem"
                className="w-14 h-14 object-contain rounded-full bg-white p-1 flex-shrink-0 shadow img-hd"
              />
              <div>
                <p
                  className="text-[10px] uppercase font-bold tracking-wider"
                  style={{ color: "#f9a825" }}
                >
                  Shriram Education Society's
                </p>
                <span
                  className="text-white font-bold text-sm sm:text-base leading-tight block"
                  style={{ fontFamily: "Lora, Georgia, serif" }}
                >
                  Shri. Anandrao Pawar Mahavidyalaya
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 mb-4">
              Arts, Commerce & Science Mahavidyalaya, Kanganewadi, Khend,
              Chiplun. Affiliated to University of Mumbai and Accredited by
              NAAC.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
              <span>⭐</span> NAAC 'C' Grade Accredited
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="text-amber-400">🔗</span> Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { to: "/", label: "Home Page" },

                { to: "/about", label: "About College" },

                { to: "/academics", label: "Academics" },

                { to: "/infrastructure", label: "Campus Infrastructure" },

                { to: "/gallery", label: "Gallery" },

                { to: "/notices", label: "Notice Board" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-amber-400 text-xs">›</span>
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Academic Programs */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="text-amber-400">🎓</span> Academic Wings
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="font-semibold text-slate-200">
                Junior College (11th & 12th):
              </li>
              <li className="pl-3 text-xs">• Arts Stream</li>
              <li className="pl-3 text-xs">• Commerce Stream (with IT)</li>
              <li className="pl-3 text-xs">• Science Stream (with IT)</li>
              <li className="font-semibold text-slate-200 pt-2">
                Undergraduate Degree:
              </li>
              <li className="pl-3 text-xs">• Bachelor of Arts (B.A.)</li>
              <li className="pl-3 text-xs">• Bachelor of Commerce (B.Com)</li>
              <li className="pl-3 text-xs">• Bachelor of Science (B.Sc.)</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="text-amber-400">📍</span> Campus Address
            </h4>
            <address className="not-italic text-xs sm:text-sm text-slate-400 space-y-2.5">
              <p className="font-semibold text-slate-200">
                Kanganewadi, Khend, Chiplun
              </p>
              <p>Tal. Chiplun, Dist. Ratnagiri</p>
              <p>Maharashtra — 415 605</p>
              <div className="pt-2">
                <p className="text-xs text-slate-400">Email Inquiry:</p>
                <a
                  href="mailto:shriram.society@rediffmail.com"
                  className="text-amber-300 hover:text-amber-200 transition-colors break-all font-medium text-xs sm:text-sm"
                >
                  shriram.society@rediffmail.com
                </a>
              </div>
              <div className="pt-2"></div>
            </address>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Shriram Education Society's Shri.
            Anandrao Pawar College, Chiplun. All rights reserved.
          </p>
          <p className="text-amber-300 font-medium">
            Affiliated to University of Mumbai · NAAC Accredited
          </p>
        </div>
      </div>
    </footer>
  )
}
