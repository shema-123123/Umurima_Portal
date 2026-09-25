import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ExportButtons from '../components/ExportButtons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Icons served as images from the lucide-static CDN (unpkg) — no bundling needed.
const ICON = (name) => `https://unpkg.com/lucide-static@latest/icons/${name}.svg`;

const COLORS = ['#1e3a8a', '#1d4ed8', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [farms, setFarms] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [searchFarm, setSearchFarm] = useState('');

  const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };

  useEffect(() => {
    const load = async () => {
      try {
        const [u, f, s] = await Promise.all([
          axios.get('https://umurima-portal-0ulc.onrender.com/api/users', authHeader),
          axios.get('https://umurima-portal-0ulc.onrender.com/api/farms', authHeader),
          axios.get('https://umurima-portal-0ulc.onrender.com/api/analytics/stats', authHeader),
        ]);
        setUsers(u.data);
        setFarms(f.data);
        setStats(s.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`https://umurima-portal-0ulc.onrender.com/api/users/${id}`, authHeader);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.identityNumber.includes(searchUser)
  );

  const filteredFarms = farms.filter(
    (f) =>
      f.farmName.toLowerCase().includes(searchFarm.toLowerCase()) ||
      f.cropType.toLowerCase().includes(searchFarm.toLowerCase()) ||
      f.userId?.username?.toLowerCase().includes(searchFarm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-blue-950 to-sky-900">
        <div className="flex items-center gap-3 text-white text-xl">
          <img src={ICON('loader-circle')} alt="" className="w-6 h-6 invert animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-extrabold text-blue-900">
              <img src={ICON('layout-dashboard')} alt="" className="w-7 h-7" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user.username}</p>
          </div>
          <ExportButtons
            excelUrl="https://umurima-portal-0ulc.onrender.com/api/export/all-farms/excel"
            pdfUrl="https://umurima-portal-0ulc.onrender.com/api/export/all-farms/pdf"
            baseName="all_farms"
          />
        </div>

        <div className="flex gap-2 mb-6 border-b border-sky-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: 'bar-chart-3' },
            { id: 'users', label: 'Users', icon: 'users' },
            { id: 'farms', label: 'Farms', icon: 'sprout' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 font-semibold whitespace-nowrap transition ${
                tab === t.id
                  ? 'border-b-2 border-blue-900 text-blue-900'
                  : 'text-gray-500 hover:text-blue-800'
              }`}
            >
              <img
                src={ICON(t.icon)}
                alt=""
                className={`w-4 h-4 ${tab === t.id ? '' : 'opacity-60'}`}
                style={
                  tab === t.id
                    ? { filter: 'invert(16%) sepia(64%) saturate(1974%) hue-rotate(202deg) brightness(94%) contrast(97%)' }
                    : undefined
                }
              />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: 'users', label: 'Farmers', value: stats.totalUsers },
                { icon: 'sprout', label: 'Farms', value: stats.totalFarms },
                { icon: 'ruler', label: 'Total Size (ha)', value: stats.totalSize?.toFixed(2) },
                { icon: 'trees', label: 'Total Trees', value: stats.totalTrees },
              ].map((c, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-sky-200 shadow-sm p-5 text-center"
                >
                  <img src={ICON(c.icon)} alt="" className="w-6 h-6 mx-auto mb-2 opacity-70" />
                  <p className="text-gray-500 text-sm">{c.label}</p>
                  <p className="text-3xl font-bold text-blue-900">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-sky-200 shadow-sm p-5">
                <h3 className="flex items-center gap-2 font-bold mb-4 text-blue-900">
                  <img src={ICON('bar-chart-3')} alt="" className="w-5 h-5" />
                  Top Crops
                </h3>
                {stats.crops?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={stats.crops.map((c) => ({
                        name: c._id,
                        count: c.count,
                      }))}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-10">No data available</p>
                )}
              </div>

              <div className="bg-white rounded-xl border border-sky-200 shadow-sm p-5">
                <h3 className="flex items-center gap-2 font-bold mb-4 text-blue-900">
                  <img src={ICON('trees')} alt="" className="w-5 h-5" />
                  Tree Types
                </h3>
                {stats.trees?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.trees.map((t) => ({
                          name: t._id,
                          value: t.count,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {stats.trees.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-10">No data available</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-sky-200 shadow-sm p-5">
              <h3 className="flex items-center gap-2 font-bold mb-4 text-blue-900">
                <img src={ICON('map-pin')} alt="" className="w-5 h-5" />
                Farms by Location
              </h3>
              {stats.locations?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={stats.locations.map((l) => ({
                      name: l._id,
                      count: l.count,
                    }))}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-10">No data available</p>
              )}
            </div>
          </>
        )}

        {tab === 'users' && (
          <div className="bg-white rounded-xl border border-sky-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900">
                <img src={ICON('users')} alt="" className="w-5 h-5" />
                Users ({filteredUsers.length})
              </h3>
              <div className="relative max-w-xs w-full">
                <img
                  src={ICON('search')}
                  alt=""
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                />
                <input
                  type="text"
                  placeholder="Search username or ID number..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-sky-50 text-blue-900">
                  <tr>
                    <th className="p-3 text-left font-semibold">Username</th>
                    <th className="p-3 text-left font-semibold">ID Number</th>
                    <th className="p-3 text-left font-semibold">Phone</th>
                    <th className="p-3 text-left font-semibold">Location</th>
                    <th className="p-3 text-left font-semibold">Role</th>
                    <th className="p-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-sky-50 transition">
                      <td className="p-3 font-semibold text-gray-800">{u.username}</td>
                      <td className="p-3 font-mono text-xs text-gray-600">
                        {u.identityNumber}
                      </td>
                      <td className="p-3 text-gray-600">{u.telephone}</td>
                      <td className="p-3 text-gray-600">{u.location}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.role === 'admin'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-sky-100 text-blue-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition"
                          >
                            <img src={ICON('trash-2')} alt="" className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'farms' && (
          <div className="bg-white rounded-xl border border-sky-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900">
                <img src={ICON('sprout')} alt="" className="w-5 h-5" />
                All Farms ({filteredFarms.length})
              </h3>
              <div className="relative max-w-xs w-full">
                <img
                  src={ICON('search')}
                  alt=""
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                />
                <input
                  type="text"
                  placeholder="Search farm, crop, or owner..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  value={searchFarm}
                  onChange={(e) => setSearchFarm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-sky-50 text-blue-900">
                  <tr>
                    <th className="p-3 text-left font-semibold">Farm</th>
                    <th className="p-3 text-left font-semibold">Owner</th>
                    <th className="p-3 text-left font-semibold">Crop</th>
                    <th className="p-3 text-left font-semibold">Size</th>
                    <th className="p-3 text-left font-semibold">Location</th>
                    <th className="p-3 text-left font-semibold">Trees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFarms.map((f) => (
                    <tr key={f._id} className="hover:bg-sky-50 transition">
                      <td className="p-3 font-semibold text-gray-800">{f.farmName}</td>
                      <td className="p-3 text-gray-600">{f.userId?.username || '-'}</td>
                      <td className="p-3 text-gray-600">{f.cropType}</td>
                      <td className="p-3 text-gray-600">{f.size} ha</td>
                      <td className="p-3 text-gray-600">{f.location}</td>
                      <td className="p-3">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-blue-800">
                          {f.treeCount || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredFarms.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        No farms found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}