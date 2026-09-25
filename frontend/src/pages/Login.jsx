import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.username, form.password);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
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
          <div className="text-5xl mb-2">🔐</div>
          <h2 className="text-3xl font-bold text-primary-dark">Injira</h2>
          <p className="text-gray-500 text-sm">Injira kuri konti yawe</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input
              type="text"
              placeholder="Shyiramo username"
              className="input-field"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="Shyiramo password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? '⏳ Turimo...' : 'Injira'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Nta konti ufite?{' '}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Iyandikishe
          </Link>
        </p>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-gray-700 border border-blue-200">
          <p className="font-bold mb-2 text-center">🧪 Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-white rounded">
              <p className="font-semibold text-purple-700">Admin</p>
              <p>admin / admin123</p>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <p className="font-semibold text-green-700">User</p>
              <p>umuhinzi1 / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}