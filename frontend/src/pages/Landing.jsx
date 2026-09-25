import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🌾</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-6">
          Murakaza neza kuri Abahinzi Portal
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Sisitemu yoroshye yo gucunga amakuru y'imirima yawe, ibiti yaterewe,
          n'ibikorwa byose by'ubuhinzi. Bika, reba kandi wohereze raporo muri
          Excel na PDF.
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-16">
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            🚀 Tangira Ubu
          </Link>
          <Link
            to="/login"
            className="bg-white text-primary border-2 border-primary font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition"
          >
            🔐 Injira
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: '🌱',
              title: 'Kwiyandikisha',
              desc: 'Fungura konti yawe ukoresheje indangamuntu, telefone na location yawe.',
            },
            {
              icon: '🗺️',
              title: 'Gucunga Imirima',
              desc: 'Andika imirima yawe, ingano, ibihingwa, n\'ibiti yaterewe.',
            },
            {
              icon: '📊',
              title: 'Raporo & Export',
              desc: 'Reba imibare kandi ubikuze raporo muri Excel cyangwa PDF.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="card text-center hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-primary-dark">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-white rounded-xl shadow max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-primary-dark mb-3">
            🔐 Demo Credentials
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="p-3 bg-green-50 rounded">
              <p className="font-bold">👨‍💼 Admin</p>
              <p className="text-sm">
                Username: <code>admin</code>
              </p>
              <p className="text-sm">
                Password: <code>admin123</code>
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <p className="font-bold">👨‍🌾 User</p>
              <p className="text-sm">
                Username: <code>umuhinzi1</code>
              </p>
              <p className="text-sm">
                Password: <code>user123</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}