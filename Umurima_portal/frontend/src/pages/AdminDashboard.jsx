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

const COLORS = [
  '#16a34a',
  '#22c55e',
  '#4ade80',
  '#86efac',
  '#bbf7d0',
  '#dcfce7',
];

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
    if (!window.confirm('Urabyemeza gusiba uyu mukoresha?')) return;
    try {
      await axios.delete(`https://umurima-portal-0ulc.onrender.com/api/users/${id}`, authHeader);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Habaye ikibazo');
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-primary text-xl">⏳ Turimo gutangiza...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark">
              👨‍💼 Admin Dashboard
            </h1>
            <p className="text-gray-600">Murakaza neza, {user.username}</p>
          </div>
          <ExportButtons
            excelUrl="https://umurima-portal-0ulc.onrender.com/api/export/all-farms/excel"
            pdfUrl="https://umurima-portal-0ulc.onrender.com/api/export/all-farms/pdf"
            baseName="imirima_yose"
          />
        </div>

        <div className="flex gap-2 mb-6 border-b overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'users', label: '👥 Abakoresha' },
            { id: 'farms', label: '🌾 Imirima' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 font-semibold whitespace-nowrap transition ${
                tab === t.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card text-center">
                <p className="text-gray-500 text-sm">Abahinzi</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="card text-center">
                <p className="text-gray-500 text-sm">Imirima</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalFarms}
                </p>
              </div>
              <div className="card text-center">
                <p className="text-gray-500 text-sm">Ingano yose (ha)</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalSize?.toFixed(2)}
                </p>
              </div>
              <div className="card text-center">
                <p className="text-gray-500 text-sm">Ibiti byose</p>
                <p className="text-3xl font-bold text-primary">
                  {stats.totalTrees}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="card">
                <h3 className="font-bold mb-4 text-primary-dark">
                  🌾 Ibihingwa Byinshi
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
                      <Bar dataKey="count" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-10">Nta makuru</p>
                )}
              </div>

              <div className="card">
                <h3 className="font-bold mb-4 text-primary-dark">
                  🌳 Ubwoko bw'Ibiti
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
                  <p className="text-gray-500 text-center py-10">Nta makuru</p>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold mb-4 text-primary-dark">
                📍 Imirima ku Turere
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
                    <Bar dataKey="count" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-10">Nta makuru</p>
              )}
            </div>
          </>
        )}

        {tab === 'users' && (
          <div className="card">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-bold text-primary-dark">
                👥 Abakoresha ({filteredUsers.length})
              </h3>
              <input
                type="text"
                placeholder="🔍 Shakisha username cyangwa indangamuntu..."
                className="input-field max-w-xs"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Username</th>
                    <th className="p-3 text-left">Indangamuntu</th>
                    <th className="p-3 text-left">Telefone</th>
                    <th className="p-3 text-left">Aho Atuye</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold">{u.username}</td>
                      <td className="p-3 font-mono text-xs">
                        {u.identityNumber}
                      </td>
                      <td className="p-3">{u.telephone}</td>
                      <td className="p-3">{u.location}</td>
                      <td className="p-3">
                        <span
                          className={`badge ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="text-red-500 hover:underline"
                          >
                            🗑️ Siba
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        Nta bakoresha babonetse
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'farms' && (
          <div className="card">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-bold text-primary-dark">
                🌾 Imirima Yose ({filteredFarms.length})
              </h3>
              <input
                type="text"
                placeholder="🔍 Shakisha umurima, igihingwa, nyir'umurima..."
                className="input-field max-w-xs"
                value={searchFarm}
                onChange={(e) => setSearchFarm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Umurima</th>
                    <th className="p-3 text-left">Nyir'Umurima</th>
                    <th className="p-3 text-left">Igihingwa</th>
                    <th className="p-3 text-left">Ingano</th>
                    <th className="p-3 text-left">Aho Uherereye</th>
                    <th className="p-3 text-left">Ibiti</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFarms.map((f) => (
                    <tr key={f._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold">{f.farmName}</td>
                      <td className="p-3">{f.userId?.username || '-'}</td>
                      <td className="p-3">{f.cropType}</td>
                      <td className="p-3">{f.size} ha</td>
                      <td className="p-3">{f.location}</td>
                      <td className="p-3">
                        <span className="badge bg-green-100 text-green-700">
                          {f.treeCount || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredFarms.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        Nta mirima ibonetse
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