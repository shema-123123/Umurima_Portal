import { useState } from 'react';

// Icons served as images from the lucide-static CDN (unpkg) — no bundling needed.
const ICON = (name) => `https://unpkg.com/lucide-static@latest/icons/${name}.svg`;

const COMMON_TREES = [
  'Mango',
  'Avocado',
  'Banana',
  'Papaya',
  'Cassava',
  'Orange',
  'Lemon',
  'Guava',
  'Passion Fruit',
  'Onion',
  'Coffee',
  'Palm Tree',
];

export default function TreeInput({ treeCount, treeTypes, onChange }) {
  const [custom, setCustom] = useState('');

  const toggleTree = (tree) => {
    const list = treeTypes.includes(tree)
      ? treeTypes.filter((t) => t !== tree)
      : [...treeTypes, tree];
    onChange({ treeCount, treeTypes: list });
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !treeTypes.includes(trimmed)) {
      onChange({ treeCount, treeTypes: [...treeTypes, trimmed] });
      setCustom('');
    }
  };

  return (
    <div className="border-2 border-dashed border-sky-300 rounded-xl p-5 bg-blue-50">
      <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
        <img src={ICON('trees')} alt="" className="w-5 h-5" />
        Trees Planted
      </h4>

      <label className="block text-sm font-semibold mb-1 text-gray-700">
        Number of Trees
      </label>
      <input
        type="number"
        min="0"
        className="w-full mb-4 px-3 py-2 rounded-lg border border-sky-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
        placeholder="e.g. 50"
        value={treeCount}
        onChange={(e) =>
          onChange({ treeCount: Number(e.target.value) || 0, treeTypes })
        }
      />

      <label className="block text-sm font-semibold mb-2 text-gray-700">
        Tree Types (select one or more)
      </label>
      <div className="flex flex-wrap gap-2 mb-4">
        {COMMON_TREES.map((tree) => {
          const selected = treeTypes.includes(tree);
          return (
            <button
              key={tree}
              type="button"
              onClick={() => toggleTree(tree)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border font-medium transition ${
                selected
                  ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-sky-400 hover:text-blue-900'
              }`}
            >
              <img
                src={ICON(selected ? 'check' : 'plus')}
                alt=""
                className={`w-3.5 h-3.5 ${selected ? 'invert' : 'opacity-60'}`}
              />
              {tree}
            </button>
          );
        })}
      </div>

      <label className="block text-sm font-semibold mb-1 text-gray-700">
        Add a New Type
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg border border-sky-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
          placeholder="Type a new tree name..."
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <button
          type="button"
          onClick={addCustom}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow shadow-red-900/30 transition"
        >
          <img src={ICON('plus')} alt="" className="w-4 h-4 invert" />
          Add
        </button>
      </div>

      {treeTypes.length > 0 && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-sky-200">
          <p className="text-xs text-gray-500 mb-2">
            Selected ({treeTypes.length}):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {treeTypes.map((t) => (
              <span
                key={t}
                className="bg-sky-100 text-blue-900 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5"
              >
                {t}
                <button
                  type="button"
                  onClick={() => toggleTree(t)}
                  className="text-red-600 hover:text-red-800 font-bold leading-none"
                  aria-label={`Remove ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}