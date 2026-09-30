import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const linkClass =
    'text-sm font-medium text-slate-600 hover:text-gold transition-colors';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="h-10 w-10 transition-transform group-hover:scale-105" />
            <span className="font-serif text-xl sm:text-2xl font-semibold text-navy tracking-tight">
              Rafna Investment
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={linkClass}>
              Home
            </Link>
            <Link to="/shop" className={linkClass}>
              Shop
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg text-sm font-medium text-navy border border-slate-200 hover:border-gold hover:text-gold transition-colors"
            >
              Admin
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-gold"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-gold"
          >
            Shop
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-navy hover:text-gold"
          >
            Admin
          </Link>
        </div>
      )}

      {isAdmin && (
        <div className="bg-navy text-white text-xs py-1.5 text-center font-medium tracking-wide">
          Admin area — click the logo to return to the public website
        </div>
      )}
    </header>
  );
}
