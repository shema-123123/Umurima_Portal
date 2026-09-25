import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TreeInput from './components/TreeInput';
import ExportButtons from './components/ExportButtons';

export default function UserDashboard() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('farms');
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    username: user.username,
    telephone: user.telephone,
    location: user.location,
  });
  const [newFarm, setNewFarm] = useState({
    farmName: '',
    cropType: '',
    size: '',
    location: '',
    soilType: '',
    plantingDate: '',
    expectedHarvest: '',
    notes: '',
    treeCount: 0,
    treeTypes: [],
  });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const loadFarms = async () => {
    try {
      const { data } = await axios.get('/api/farms/my-farms', authHeader);
      setFarms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
    // eslint-disable-next-line
  }, []);

  const addFarm = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/farms',
        { ...newFarm, size: Number(newFarm.size) },
        authHeader
      );
      setNewFarm({
        farmName: '',
        cropType: '',
        size: '',
        location: '',
        soilType: '',
        plantingDate: '',
        expectedHarvest: '',
        notes: '',
        treeCount: 0,
        treeTypes: [],
      });
      showMsg('✅ Umurima wongeweho neza!');
      loadFarms();
      setTab('farms');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Habaye ikibazo', 'error');
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/users/${user._id}`,
        profile,
        authHeader
      );
      updateUser(data);
      showMsg('✅ Umwirondoro wahinduwe!');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Habaye ikibazo', 'error');
    }
  };

  const deleteFarm = async (id) => {
    if (!window.confirm('Urabyemeza gusiba uyu murima?')) return;
    try {
      await axios.delete(`/api/farms/${id}`, authHeader);
      showMsg('✅ Umurima wasibwe!');
      loadFarms();
    } catch (err) {
      showMsg('Habaye ikibazo', 'error');
    }
  };

  const totalSize = farms.reduce((a, f) => a + (f.size || 0), 0);
  const totalTrees = farms.reduce((a, f) => a + (f.treeCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark">
              🌱 Muraho, {user.username}!
            </h1>
            <p className="text-gray-600">Ubuyobozi bw'umurima wawe</p>
          </div>
          <ExportButtons
            excelUrl="/api/export/my-farms/excel"
            pdfUrl="/api/export/my-farms/pdf"
            baseName="imirima_yanjye"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <p className="text-gray-500 text-sm">Imirima</p>
            <p className="text-3xl font-bold text-primary">{farms.length}</p>
          </div>
          <div className="card text-center">
            <p className="text-gray-500 text-sm">Ingano yose (ha)</p>
            <p className="text-3xl font-bold text-primary">
              {totalSize.toFixed(2)}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-gray-500 text-sm">Ibiti byose</p>
            <p className="text-3xl font-bold text-primary">{totalTrees}</p>
          </div>
        </div>

        {msg.text && (
          <div
            className={`p-3 rounded-lg mb-4 ${
              msg.type === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b overflow-x-auto">
          {[
            { id: 'farms', label: 'Imirima Yanjye' },
            { id: 'add-farm', label: '➕ Ongeraho Umurima' },
            { id: 'profile', label: '👤 Umwirondoro' },
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

        {tab === 'farms' && (
          <>
            {loading ? (
              <p className="text-center text-gray-500 py-10">⏳ Turimo...</p>
            ) : farms.length === 0 ? (
              <div className="card text-center py-10">
                <p className="text-5xl mb-3">🌾</p>
                <p className="text-gray-500 mb-4">Nta mirima ufite.</p>
                <button
                  onClick={() => setTab('add-farm')}
                  className="btn-primary"
                >
                  ➕ Ongeraho Umurima wa Mbere
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {farms.map((f) => (
                  <div key={f._id} className="card hover:shadow-lg transition">
                    <h3 className="font-bold text-lg text-primary-dark mb-2">
                      {f.farmName}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-2">
                      <p>
                        🌾 Igihingwa: <strong>{f.cropType}</strong>
                      </p>
                      <p>
                        📏 Ingano: <strong>{f.size} ha</strong>
                      </p>
                      <p>📍 {f.location}</p>
                      <p>🪨 Ubutaka: {f.soilType}</p>
                      {f.plantingDate && (
                        <p>
                          📅 Gutera:{' '}
                          {new Date(f.plantingDate).toLocaleDateString('rw-RW')}
                        </p>
                      )}
                      {f.expectedHarvest && (
                        <p>
                          🌾 Gusarura:{' '}
                          {new Date(f.expectedHarvest).toLocaleDateString(
                            'rw-RW'
                          )}
                        </p>
                      )}
                    </div>

                    <div className="p-2 bg-green-50 rounded mt-2">
                      <p className="text-sm font-semibold text-green-800">
                        🌳 Ibiti: {f.treeCount || 0}
                      </p>
                      {f.treeTypes?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {f.treeTypes.map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-green-200 text-green-900 px-2 py-0.5 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {f.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        📝 {f.notes}
                      </p>
                    )}

                    <button
                      onClick={() => deleteFarm(f._id)}
                      className="mt-3 text-red-500 text-sm hover:underline"
                    >
                      🗑️ Siba
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'add-farm' && (
          <form onSubmit={addFarm} className="card max-w-2xl mx-auto space-y-3">
            <h3 className="text-xl font-bold text-primary-dark mb-2">
              ➕ Ongeraho Umurima Mushya
            </h3>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Izina ry'Umurima *
              </label>
              <input
                className="input-field"
                placeholder="Urugero: Umurima wa Mbere"
                required
                value={newFarm.farmName}
                onChange={(e) =>
                  setNewFarm({ ...newFarm, farmName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Igihingwa *
                </label>
                <input
                  className="input-field"
                  placeholder="Ibigori, Ibirayi..."
                  required
                  value={newFarm.cropType}
                  onChange={(e) =>
                    setNewFarm({ ...newFarm, cropType: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Ingano (ha) *
                </label>
                <input
                  className="input-field"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Urugero: 2.5"
                  required
                  value={newFarm.size}
                  onChange={(e) =>
                    setNewFarm({ ...newFarm, size: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Aho Uherereye *
              </label>
              <input
                className="input-field"
                placeholder="Urugero: Gasabo - Ndera"
                required
                value={newFarm.location}
                onChange={(e) =>
                  setNewFarm({ ...newFarm, location: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Ubwoko bw'Ubutaka
              </label>
              <input
                className="input-field"
                placeholder="Loam, Volcanic..."
                value={newFarm.soilType}
                onChange={(e) =>
                  setNewFarm({ ...newFarm, soilType: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Italiki yo Gutera
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={newFarm.plantingDate}
                  onChange={(e) =>
                    setNewFarm({ ...newFarm, plantingDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Italiki yo Gusarura
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={newFarm.expectedHarvest}
                  onChange={(e) =>
                    setNewFarm({ ...newFarm, expectedHarvest: e.target.value })
                  }
                />
              </div>
            </div>

            <TreeInput
              treeCount={newFarm.treeCount}
              treeTypes={newFarm.treeTypes}
              onChange={({ treeCount, treeTypes }) =>
                setNewFarm({ ...newFarm, treeCount, treeTypes })
              }
            />

            <div>
              <label className="block text-sm font-semibold mb-1">
                Andi Makuru
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Andi makuru ku murima..."
                value={newFarm.notes}
                onChange={(e) =>
                  setNewFarm({ ...newFarm, notes: e.target.value })
                }
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              💾 Bika Umurima
            </button>
          </form>
        )}

        {tab === 'profile' && (
          <form
            onSubmit={updateProfile}
            className="card max-w-2xl mx-auto space-y-3"
          >
            <h3 className="text-xl font-bold text-primary-dark mb-2">
              👤 Umwirondoro
            </h3>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">
                Indangamuntu (ntishobora guhinduka)
              </p>
              <p className="font-mono font-bold">{user.identityNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Username
              </label>
              <input
                className="input-field"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Telefone
              </label>
              <input
                className="input-field"
                value={profile.telephone}
                onChange={(e) =>
                  setProfile({ ...profile, telephone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Aho Utuye
              </label>
              <input
                className="input-field"
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              💾 Bika Impinduka
            </button>
          </form>
        )}
      </div>
    </div>
  );
}