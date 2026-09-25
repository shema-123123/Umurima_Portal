import { Link } from 'react-router-dom';

// Icons served as images from the lucide-static CDN (unpkg) — no bundling needed.
const ICON = (name) => `https://unpkg.com/lucide-static@latest/icons/${name}.svg`;

export default function Landing() {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-blue-950 to-sky-900">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <img
          src={ICON('wheat')}
          alt="Wheat icon"
          className="w-16 h-16 mx-auto mb-4 invert"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg">
          Welcome to{' '}
          <span className="text-sky-400">Abahinzi Portal</span>
        </h1>
        <p className="text-lg md:text-xl text-sky-100/90 mb-10 max-w-2xl mx-auto">
          A simple system to manage your farm data, planted crops,
          and all your farming activities. Save, view, and export reports
          in Excel and PDF.
        </p>

        {/* CTA buttons */}
        <div className="flex gap-4 justify-center flex-wrap mb-16">
          <Link
            to="/register"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-lg shadow-red-900/40 transition transform hover:-translate-y-0.5"
          >
            <img src={ICON('rocket')} alt="" className="w-5 h-5 invert" />
            Get Started
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 bg-white text-blue-800 border-2 border-sky-400 font-semibold px-8 py-3 rounded-lg hover:bg-sky-50 transition"
          >
            <img src={ICON('lock-keyhole')} alt="" className="w-5 h-5" />
            Login
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: 'sprout',
              title: 'Registration',
              desc: 'Create your account using your ID, phone number, and location.',
            },
            {
              icon: 'map',
              title: 'Manage Farms',
              desc: "Record your farms, size, crops, and planted trees.",
            },
            {
              icon: 'bar-chart-3',
              title: 'Reports & Export',
              desc: 'View statistics and export reports in Excel or PDF.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-sky-200 shadow-md hover:shadow-xl hover:shadow-blue-900/20 transition p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                <img src={ICON(f.icon)} alt={f.title} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-900">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Demo credentials */}
        <div className="mt-16 p-6 bg-white rounded-xl shadow-xl border-t-4 border-red-600 max-w-3xl mx-auto">
          <h3 className="flex items-center justify-center gap-2 text-xl font-bold text-blue-900 mb-4">
            <img src={ICON('shield-check')} alt="" className="w-5 h-5" />
            Demo Credentials
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="flex items-center gap-2 font-bold text-blue-900 mb-1">
                <img src={ICON('user-cog')} alt="" className="w-4 h-4" />
                Admin
              </p>
              <p className="text-sm text-gray-700">
                Username: <code className="text-red-600 font-semibold">admin</code>
              </p>
              <p className="text-sm text-gray-700">
                Password: <code className="text-red-600 font-semibold">admin123</code>
              </p>
            </div>
            <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
              <p className="flex items-center gap-2 font-bold text-blue-900 mb-1">
                <img src={ICON('user')} alt="" className="w-4 h-4" />
                User
              </p>
              <p className="text-sm text-gray-700">
                Username: <code className="text-red-600 font-semibold">umuhinzi1</code>
              </p>
              <p className="text-sm text-gray-700">
                Password: <code className="text-red-600 font-semibold">user123</code>
              </p>
            </div>
          </div>
        </div>

        {/* Stats overview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { icon: 'users', label: 'Farmers', value: '1,240+' },
            { icon: 'sprout', label: 'Farms Registered', value: '3,860' },
            { icon: 'trending-up', label: 'Yield Rate', value: '92%' },
            { icon: 'file-down', label: 'Reports Generated', value: '5,400+' },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-blue-950/60 border border-sky-800 rounded-xl p-5 text-center backdrop-blur"
            >
              <img src={ICON(s.icon)} alt="" className="w-6 h-6 mx-auto mb-2 invert" />
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-sky-200">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent activity table */}
        <div className="mt-16 bg-white rounded-xl shadow-xl overflow-hidden max-w-5xl mx-auto text-left">
          <div className="flex items-center gap-2 bg-blue-900 text-white px-6 py-4">
            <img src={ICON('list-checks')} alt="" className="w-5 h-5 invert" />
            <h3 className="font-bold text-lg">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sky-50 text-blue-900">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Farmer</th>
                  <th className="px-6 py-3 text-left font-semibold">Action</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'J. Mugisha', action: 'Added a farm', date: '24/09/2026', status: 'Approved' },
                  { name: 'A. Uwase', action: 'Submitted a report (PDF)', date: '23/09/2026', status: 'Processed' },
                  { name: 'E. Nkurunziza', action: 'Updated crops', date: '22/09/2026', status: 'Pending' },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-sky-50 transition">
                    <td className="px-6 py-3 font-medium text-gray-800">{r.name}</td>
                    <td className="px-6 py-3 text-gray-600">{r.action}</td>
                    <td className="px-6 py-3 text-gray-600">{r.date}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'Approved'
                            ? 'bg-sky-100 text-blue-800'
                            : r.status === 'Processed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 bg-black border-t border-sky-900/50">
        <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4 text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={ICON('wheat')} alt="" className="w-6 h-6 invert" />
              <span className="text-white font-bold text-lg">Abahinzi Portal</span>
            </div>
            <p className="text-sm text-gray-400">
              A simple system to manage farm data, crops,
              and farming activities in Rwanda.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/register" className="hover:text-sky-400 transition">Register</Link></li>
              <li><Link to="/login" className="hover:text-sky-400 transition">Login</Link></li>
              <li><Link to="/about" className="hover:text-sky-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-sky-400 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-sky-400 transition">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-sky-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-sky-400 transition">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <img src={ICON('mail')} alt="" className="w-4 h-4 invert opacity-70" />
                info@abahinzi.rw
              </li>
              <li className="flex items-center gap-2">
                <img src={ICON('phone')} alt="" className="w-4 h-4 invert opacity-70" />
                +250 788 000 000
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-950 border border-sky-800 hover:bg-red-600 hover:border-red-600 transition"
                >
                  <img src={ICON(s)} alt={s} className="w-4 h-4 invert" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-sky-900/50 py-5">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Abahinzi Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}