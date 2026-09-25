import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons served as images from the lucide-static CDN (unpkg) — no bundling needed.
const ICON = (name) => `https://unpkg.com/lucide-static@latest/icons/${name}.svg`;

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
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'username', type: 'text', placeholder: 'Username', icon: 'user', extra: { minLength: 3 } },
    { key: 'identityNumber', type: 'text', placeholder: 'ID Number (16 digits)', icon: 'id-card' },
    { key: 'telephone', type: 'tel', placeholder: 'Phone (07XXXXXXXX)', icon: 'phone' },
    { key: 'location', type: 'text', placeholder: 'Location (Province - District)', icon: 'map-pin' },
    { key: 'password', type: 'password', placeholder: 'Password (min. 6 characters)', icon: 'key-round', extra: { minLength: 6 } },
    { key: 'confirmPassword', type: 'password', placeholder: 'Confirm password', icon: 'shield-check' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-blue-950 to-sky-900 py-10 px-4">
      <div className="bg-white rounded-2xl shadow-2xl border-t-4 border-red-600 w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center">
            <img src={ICON('user-plus')} alt="" className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-bold text-blue-900">Register</h2>
          <p className="text-gray-500 text-sm">Create a new account</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
            <img src={ICON('circle-alert')} alt="" className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map((f) => (
            <div key={f.key} className="relative">
              <img
                src={ICON(f.icon)}
                alt=""
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
              />
              <input
                type={f.type}
                placeholder={f.placeholder}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-sky-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                required
                {...f.extra}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg shadow shadow-red-900/30 transition"
          >
            {loading ? (
              <>
                <img src={ICON('loader-circle')} alt="" className="w-4 h-4 invert animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <img src={ICON('user-plus')} alt="" className="w-4 h-4 invert" />
                Register
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-800 font-semibold hover:text-sky-600 hover:underline transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}