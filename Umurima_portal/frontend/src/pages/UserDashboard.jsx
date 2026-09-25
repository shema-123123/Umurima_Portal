import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TreeInput from '../components/TreeInput';
import ExportButtons from '../components/ExportButtons';

// Icons served as images from the lucide-static CDN (unpkg) — no bundling needed.
const ICON = (name) => `https://unpkg.com/lucide-static@latest/icons/${name}.svg`;

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
      const { data } = await axios.get('https://umurima-portal-0ulc.onrender.com/api/farms/my-farms', authHeader);
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
      showMsg('Farm added successfully!');
      loadFarms();
      setTab('farms');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `https://umurima-portal-0ulc.onrender.com/api/users/${user._id}`,
        profile,
        authHeader
      );
      updateUser(data);
      showMsg('Profile updated!');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const deleteFarm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farm?')) return;
    try {
      await axios.delete(`https://umurima-portal-0ulc.onrender.com/api/farms/${id}`, authHeader);
      showMsg('Farm deleted!');
      loadFarms();
    } catch (err) {
      showMsg('Something went wrong', 'error');
    }
  };

  const totalSize = farms.reduce((a, f) => a + (f.size || 0), 0);
  const totalTrees = farms.reduce((a, f) => a + (f.treeCount || 0), 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-extrabold text-blue-900">
              <img src={ICON('sprout')} alt="" className="w-7 h-7" />
              Hello, {user.username}!
            </h1>
            <p className="text-gray-600">Manage your farm</p>
          </div>
          <ExportButtons
            excelUrl="https://umurima-portal-0ulc.onrender.com/api/export/my-farms/excel"
            pdfUrl="https://umurima-portal-0ulc.onrender.com/api/export/my-farms/pdf"
            baseName="my_farms"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: 'map', label: 'Farms', value: farms.length },
            { icon: 'ruler', label: 'Total Size (ha)', value: totalSize.toFixed(2) },
            { icon: 'trees', label: 'Total Trees', value: totalTrees },
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

        {msg.text && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-sm ${
              msg.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-sky-50 text-blue-800 border border-sky-200'
            }`}
          >
            <img
              src={ICON(msg.type === 'error' ? 'circle-alert' : 'circle-check')}
              alt=""
              className="w-4 h-4 shrink-0"
            />
            {msg.text}
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b border-sky-200 overflow-x-auto">
          {[
            { id: 'farms', label: 'My Farms', icon: 'sprout' },
            { id: 'add-farm', label: 'Add Farm', icon: 'plus' },
            { id: 'profile', label: 'Profile', icon: 'user' },
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
              <img src={ICON(t.icon)} alt="" className={`w-4 h-4 ${tab === t.id ? '' : 'opacity-60'}`} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'farms' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-gray-500 py-10">
                <img src={ICON('loader-circle')} alt="" className="w-5 h-5 animate-spin opacity-60" />
                Loading...
              </div>
            ) : farms.length === 0 ? (
              <div className="bg-white rounded-xl border border-sky-200 shadow-sm text-center py-12">
                <img src={ICON('wheat')} alt="" className="w-12 h-12 mx-auto mb-3 opacity-60" />
                <p className="text-gray-500 mb-4">You don't have any farms yet.</p>
                <button
                  onClick={() => setTab('add-farm')}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow shadow-red-900/30 transition"
                >
                  <img src={ICON('plus')} alt="" className="w-4 h-4 invert" />
                  Add Your First Farm
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {farms.map((f) => (
                  <div
                    key={f._id}
                    className="bg-white rounded-xl border border-sky-200 shadow-sm hover:shadow-lg transition p-5"
                  >
                    <h3 className="font-bold text-lg text-blue-900 mb-2">
                      {f.farmName}
                    </h3>
                    <div className="space-y-1.5 text-sm text-gray-600 mb-2">
                      <p className="flex items-center gap-1.5">
                        <img src={ICON('sprout')} alt="" className="w-3.5 h-3.5 opacity-60" />
                        Crop: <strong className="text-gray-800">{f.cropType}</strong>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <img src={ICON('ruler')} alt="" className="w-3.5 h-3.5 opacity-60" />
                        Size: <strong className="text-gray-800">{f.size} ha</strong>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <img src={ICON('map-pin')} alt="" className="w-3.5 h-3.5 opacity-60" />
                        {f.location}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <img src={ICON('mountain')} alt="" className="w-3.5 h-3.5 opacity-60" />
                        Soil: {f.soilType}
                      </p>
                      {f.plantingDate && (
                        <p className="flex items-center gap-1.5">
                          <img src={ICON('calendar')} alt="" className="w-3.5 h-3.5 opacity-60" />
                          Planted: {new Date(f.plantingDate).toLocaleDateString('en-GB')}
                        </p>
                      )}
                      {f.expectedHarvest && (
                        <p className="flex items-center gap-1.5">
                          <img src={ICON('calendar-check')} alt="" className="w-3.5 h-3.5 opacity-60" />
                          Harvest: {new Date(f.expectedHarvest).toLocaleDateString('en-GB')}
                        </p>
                      )}
                    </div>

                    <div className="p-2.5 bg-blue-50 rounded-lg mt-2 border border-sky-100">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-blue-900">
                        <img src={ICON('trees')} alt="" className="w-3.5 h-3.5" />
                        Trees: {f.treeCount || 0}
                      </p>
                      {f.treeTypes?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {f.treeTypes.map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-sky-100 text-blue-800 px-2 py-0.5 rounded-full font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {f.notes && (
                      <p className="flex items-start gap-1.5 text-xs text-gray-500 mt-2 italic">
                        <img src={ICON('sticky-note')} alt="" className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50" />
                        {f.notes}
                      </p>
                    )}

                    <button
                      onClick={() => deleteFarm(f._id)}
                      className="flex items-center gap-1 mt-3 text-red-600 hover:text-red-800 text-sm font-medium transition"
                    >
                      <img src={ICON('trash-2')} alt="" className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'add-farm' && (
          <form
            onSubmit={addFarm}
            className="bg-white rounded-xl border border-sky-200 shadow-sm max-w-2xl mx-auto p-6 space-y-3"
          >
            <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900 mb-2">
              <img src={ICON('plus')} alt="" className="w-5 h-5" />
              Add a New Farm
            </h3>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Farm Name *
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                placeholder="e.g. My First Farm"
                required
                value={newFarm.farmName}
                onChange={(e) =>
                  setNewFarm({ ...newFarm, farmName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Crop *
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  placeholder="Maize, Potatoes..."
                  required
                  value={newFarm.cropType}
                  onChange={(e) =>
                    setNewFarm({ ...newFarm, cropType: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Size (ha) *
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 2.5"
                  required
                  value={newFarm.size}
                  onChange={(e) =>
                    setNewFarm({ ...newFarm, size: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Location *
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                placeholder="e.g. Gasabo - Ndera"
                required
                value={newFarm.location}
                onChange={(e) =>
                  setNewFarm({ ...newFarm, location: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Soil Type
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                placeholder="Loam, Volcanic..."
                value={newFarm.soilType}
                onChange={(e) =>
                  setNewFarm({ ...newFarm, soilType: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Planting Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  value={newFarm.plantingDate}
                  onChange={(e) =>
                    setNewFarm({ ...newFarm, plantingDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Expected Harvest
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
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
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Additional Notes
              </label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                rows={3}
                placeholder="Any additional notes about the farm..."
                value={newFarm.notes}
                onChange={(e) =>
                  setNewFarm({ ...newFarm, notes: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg shadow shadow-red-900/30 transition"
            >
              <img src={ICON('save')} alt="" className="w-4 h-4 invert" />
              Save Farm
            </button>
          </form>
        )}

        {tab === 'profile' && (
          <form
            onSubmit={updateProfile}
            className="bg-white rounded-xl border border-sky-200 shadow-sm max-w-2xl mx-auto p-6 space-y-3"
          >
            <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900 mb-2">
              <img src={ICON('user')} alt="" className="w-5 h-5" />
              Profile
            </h3>

            <div className="bg-blue-50 border border-sky-100 p-3 rounded-lg">
              <p className="text-sm text-gray-500">
                ID Number (cannot be changed)
              </p>
              <p className="font-mono font-bold text-blue-900">{user.identityNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Username
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Phone
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                value={profile.telephone}
                onChange={(e) =>
                  setProfile({ ...profile, telephone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Location
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg shadow shadow-red-900/30 transition"
            >
              <img src={ICON('save')} alt="" className="w-4 h-4 invert" />
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}