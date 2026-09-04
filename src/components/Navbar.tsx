import { useState } from 'react';
import { NavLink, Link } from 'react-router';
import logo from '@/imports/1000323357.jpg';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/academics', label: 'Academics' },
  { to: '/infrastructure', label: 'Infrastructure' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/notices', label: 'Notice Board' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* 1. Utility Top Bar */}
      <div className="text-white text-xs py-1.5 px-3 sm:px-4" style={{ backgroundColor: '#0d2444' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden text-[11px] sm:text-xs">
            <span className="truncate sm:hidden">Established 2018&nbsp; | &nbsp;Kanganewadi, Khend, Chiplun</span>
            <span className="hidden sm:inline truncate">📍 Kanganewadi, Khend, Chiplun, Dist-Ratnagiri</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline">Est. 2018</span>
            <span className="hidden lg:inline text-slate-400">|</span>
            <span className="hidden lg:inline">Affiliated to University of Mumbai</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/admin"
              className="text-white font-semibold text-[11px] sm:text-xs px-2.5 py-0.5 rounded transition-all flex items-center gap-1 shadow-sm"
              style={{ backgroundColor: '#e07b00' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c06800')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e07b00')}
            >
              <span>🔒</span>
              <span className="sm:hidden">Admin Login</span>
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. College Identity Band */}
      <div className="px-3 sm:px-4 py-2 sm:py-3.5 border-b border-white/10" style={{ backgroundColor: '#1e3764' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">

          {/* Logo + College Typography */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1 group">
            <img
              src={logo}
              alt="Shriram Education Society Emblem"
              className="w-11 h-11 sm:w-16 sm:h-16 object-contain flex-shrink-0 drop-shadow-md rounded-full bg-white p-0.5 img-hd"
            />
            <div>
              <p className="text-[9px] sm:text-xs font-semibold tracking-wider uppercase mb-0.5" style={{ color: '#f9a825' }}>
                Shriram Education Society's
              </p>
              <h1
                className="text-white font-bold leading-tight text-[13px] sm:text-lg md:text-xl lg:text-2xl max-w-[190px] sm:max-w-none"
                style={{ fontFamily: 'Lora, Georgia, serif' }}
              >
                Shri. Anandrao Pawar
              </h1>
              <p className="text-white/85 font-medium text-[9px] sm:text-sm md:text-base leading-tight truncate max-w-[190px] sm:max-w-none">
                Arts, Commerce & Science Mahavidyalaya
              </p>
              <p className="text-blue-200 text-[10px] sm:text-xs mt-0.5 hidden sm:block">
                Kanganewadi, Khend, Chiplun · Affiliated to University of Mumbai
              </p>
            </div>
          </Link>

          {/* Desktop & Tablet Badges */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
            {/* NAAC Badge */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-amber-400 bg-amber-400/10">
                <span className="text-amber-300 font-bold text-[10px] lg:text-xs leading-none">NAAC</span>
                <span className="text-white font-extrabold text-sm lg:text-base leading-none mt-0.5">A</span>
              </div>
              <span className="text-slate-300 text-[10px] mt-1 font-medium">Accredited</span>
            </div>

            <div className="w-px h-10 bg-white/20" />

            {/* University of Mumbai */}
            <div className="text-center">
              <p className="text-slate-300 text-[10px]">Affiliated to</p>
              <p className="text-white font-bold text-xs leading-tight">University of</p>
              <p className="text-amber-300 font-bold text-xs leading-tight">Mumbai</p>
            </div>

            <div className="w-px h-10 bg-white/20" />

            {/* State Board */}
            <div className="text-center hidden lg:block">
              <p className="text-slate-300 text-[10px]">Approved by</p>
              <p className="text-white font-bold text-xs leading-tight">Maharashtra</p>
              <p className="text-amber-300 font-bold text-xs leading-tight">State Board</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Primary Navigation Bar */}
      <nav className="border-b-4 border-amber-500" style={{ backgroundColor: '#2a4d8f' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between h-10 sm:h-11">
          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center h-full">
            {navLinks.map(({ to, label }) => (
              <li key={to} className="h-full">
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center h-full px-4 text-xs xl:text-sm font-semibold transition-all border-b-4 -mb-1 ${isActive
                      ? 'text-white border-amber-400 bg-white/10 shadow-inner'
                      : 'text-slate-200 border-transparent hover:text-white hover:bg-white/10 hover:border-amber-300/50'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Sanskrit Motto */}


          {/* Mobile Quick Bar */}
          <div className="flex lg:hidden items-center justify-between w-full text-[11px] sm:text-xs text-white gap-3">
            <span className="font-semibold text-white truncate">
              Shri. Anandrao Pawar College, Chiplun
            </span>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="text-white p-1 rounded hover:bg-white/10 focus:outline-none transition-colors flex-shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="lg:hidden border-t border-white/15 px-3 sm:px-4 py-3 animate-fade-in shadow-2xl" style={{ backgroundColor: '#1e3764' }}>
            <div className="flex items-center justify-around py-2 px-3 rounded-xl bg-white/5 border border-white/10 mb-3 text-center text-xs">
              <div>
                <span className="text-amber-400 font-bold block">NAAC A</span>
                <span className="text-slate-300 text-[10px]">Accredited</span>
              </div>
              <div className="w-px h-6 bg-white/15" />
              <div>
                <span className="text-white font-bold block">2018</span>
                <span className="text-slate-300 text-[10px]">Established</span>
              </div>
              <div className="w-px h-6 bg-white/15" />
              <div>
                <span className="text-amber-300 font-bold block">Mumbai Univ.</span>
                <span className="text-slate-300 text-[10px]">Affiliated</span>
              </div>
            </div>

            <ul className="flex flex-col gap-1.5">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                        ? 'text-white bg-amber-500 shadow-md font-bold'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    <span>{label}</span>
                    <span className="text-xs opacity-70">›</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
