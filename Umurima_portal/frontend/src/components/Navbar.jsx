import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Icons served as images from the lucide-static CDN (unpkg) — no bundling needed.
const ICON = (name) => `https://unpkg.com/lucide-static@latest/icons/${name}.svg`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-black/95 backdrop-blur border-b border-sky-900/60 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <img src={ICON('wheat')} alt="" className="w-6 h-6 invert" />
          <span>
            Abahinzi <span className="text-sky-400">Portal</span>
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-3 items-center">
          {!user ? (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 hover:bg-blue-950 px-3 py-1.5 rounded-lg transition"
              >
                <img src={ICON('lock-keyhole')} alt="" className="w-4 h-4 invert" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-semibold shadow shadow-red-900/40 transition"
              >
                <img src={ICON('user-plus')} alt="" className="w-4 h-4 invert" />
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="flex items-center gap-2 hover:bg-blue-950 px-3 py-1.5 rounded-lg transition"
              >
                <img src={ICON('layout-dashboard')} alt="" className="w-4 h-4 invert" />
                Dashboard
              </Link>
              <span className="flex items-center gap-2 text-sm bg-blue-950 border border-sky-800 px-3 py-1.5 rounded-lg">
                <img src={ICON('user')} alt="" className="w-4 h-4 invert" />
                {user.username} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition"
              >
                <img src={ICON('log-out')} alt="" className="w-4 h-4 invert" />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-blue-950 transition"
          aria-label="Menu"
        >
          <img
            src={ICON(menuOpen ? 'x' : 'menu')}
            alt="Menu"
            className="w-6 h-6 invert"
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-950 border-t border-sky-900/60 px-4 py-4 flex flex-col gap-2">
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2 hover:text-sky-400 transition"
              >
                <img src={ICON('lock-keyhole')} alt="" className="w-4 h-4 invert" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-center transition"
              >
                <img src={ICON('user-plus')} alt="" className="w-4 h-4 invert" />
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2 hover:text-sky-400 transition"
              >
                <img src={ICON('layout-dashboard')} alt="" className="w-4 h-4 invert" />
                Dashboard
              </Link>
              <span className="flex items-center gap-2 text-sm py-2 text-sky-200">
                <img src={ICON('user')} alt="" className="w-4 h-4 invert" />
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-left transition"
              >
                <img src={ICON('log-out')} alt="" className="w-4 h-4 invert" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}