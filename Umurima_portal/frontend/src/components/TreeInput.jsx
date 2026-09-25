import { useState } from 'react';

const COMMON_TREES = [
  'Imyembe',
  'Avoka',
  'Ibitoke',
  'Papayi',
  'Kawunga',
  'Amacunga',
  'Indimu',
  'Iberi',
  'Umusekera',
  'Ibitungurusu',
  'Umwembe',
  'Umurehe',
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
    <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
      <h4 className="font-bold text-primary-dark mb-3 flex items-center gap-2">
        🌳 Ibiti Yaterewe
      </h4>

      <label className="block text-sm font-semibold mb-1 text-gray-700">
        Umubare w'Ibiti
      </label>
      <input
        type="number"
        min="0"
        className="input-field mb-3"
        placeholder="Urugero: 50"
        value={treeCount}
        onChange={(e) =>
          onChange({ treeCount: Number(e.target.value) || 0, treeTypes })
        }
      />

      <label className="block text-sm font-semibold mb-2 text-gray-700">
        Ubwoko bw'Ibiti (hitamo imwe cyangwa nyinshi)
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {COMMON_TREES.map((tree) => {
          const selected = treeTypes.includes(tree);
          return (
            <button
              key={tree}
              type="button"
              onClick={() => toggleTree(tree)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                selected
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
              }`}
            >
              {selected ? '✓ ' : '+ '}
              {tree}
            </button>
          );
        })}
      </div>

      <label className="block text-sm font-semibold mb-1 text-gray-700">
        Ongeraho ubwoko bushya
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          className="input-field flex-1"
          placeholder="Andika ubwoko bushya..."
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <button type="button" onClick={addCustom} className="btn-primary">
          Ongeraho
        </button>
      </div>

      {treeTypes.length > 0 && (
        <div className="mt-3 p-2 bg-white rounded border border-green-200">
          <p className="text-xs text-gray-500 mb-1">
            Byatoranyijwe ({treeTypes.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {treeTypes.map((t) => (
              <span
                key={t}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center gap-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() => toggleTree(t)}
                  className="text-red-500 hover:text-red-700 font-bold"
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