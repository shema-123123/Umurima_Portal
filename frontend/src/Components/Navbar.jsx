import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          🌾 <span>Abahinzi Portal</span>
        </Link>

        <div className="hidden md:flex gap-4 items-center">
          {!user ? (
            <>
              <Link
                to="/login"
                className="hover:bg-primary-dark px-3 py-1 rounded transition"
              >
                Injira
              </Link>
              <Link
                to="/register"
                className="bg-white text-primary px-4 py-1 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Iyandikishe
              </Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="hover:bg-primary-dark px-3 py-1 rounded transition"
              >
                Dashboard
              </Link>
              <span className="text-sm bg-primary-dark px-3 py-1 rounded">
                👤 {user.username} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition"
              >
                Sohoka
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-primary-dark px-4 py-3 flex flex-col gap-2">
          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2">
                Injira
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-center"
              >
                Iyandikishe
              </Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                onClick={() => setMenuOpen(false)}
                className="py-2"
              >
                Dashboard
              </Link>
              <span className="text-sm py-2">👤 {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-2 rounded-lg text-left"
              >
                Sohoka
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}