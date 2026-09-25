import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    identityNumber: '',
    telephone: '',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords ntizihura');
      return;
    }
    if (form.password.length < 6) {
      setError('Password igomba kuba nibura inyuguti 6');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Habaye ikibazo. Ongera ugerageze.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-100 py-10 px-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">📝</div>
          <h2 className="text-3xl font-bold text-primary-dark">Iyandikishe</h2>
          <p className="text-gray-500 text-sm">Fungura konti nshya</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            required
            minLength={3}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="text"
            placeholder="Indangamuntu (16 digits)"
            className="input-field"
            required
            value={form.identityNumber}
            onChange={(e) =>
              setForm({ ...form, identityNumber: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="Telefone (07XXXXXXXX)"
            className="input-field"
            required
            value={form.telephone}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Aho utuye (Province - District)"
            className="input-field"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password (nibura 6)"
            className="input-field"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="password"
            placeholder="Emeza password"
            className="input-field"
            required
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? '⏳ Turimo...' : 'Iyandikishe'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Usanzwe ufite konti?{' '}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Injira
          </Link>
        </p>
      </div>
    </div>
  );
}