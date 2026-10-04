import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  const dashboardPath = user?.role === 'owner' ? '/owner/dashboard' : '/user/dashboard';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-brand-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            🏠
          </span>
          RoomNest
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/rooms" className={navLinkClass}>Browse Rooms</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          {user && <NavLink to={dashboardPath} className={navLinkClass}>Dashboard</NavLink>}
          {user && <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <button onClick={handleLogout} className="btn-secondary !px-5 !py-2.5">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-5 !py-2.5">Login</Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5">Register</Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-6 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className={navLinkClass}>Home</NavLink>
            <NavLink to="/rooms" onClick={() => setMenuOpen(false)} className={navLinkClass}>Browse Rooms</NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)} className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)} className={navLinkClass}>Contact</NavLink>
            {user && (
              <NavLink to={dashboardPath} onClick={() => setMenuOpen(false)} className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
            {user && (
              <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={navLinkClass}>
                Profile
              </NavLink>
            )}
            {user ? (
              <button onClick={handleLogout} className="btn-secondary mt-2 w-full">Logout</button>
            ) : (
              <div className="mt-2 flex gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary w-full">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
