"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">
            🤝 Ayuda Chocó
          </h1>
          <p className="text-slate-600 text-lg">
            Plataforma solidaria para los afectados del terremoto en Chocó
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Link
            href="/necesito-ayuda"
            className="block w-full py-5 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            🆘 Necesito Ayuda
          </Link>

          <Link
            href="/quiero-ayudar"
            className="block w-full py-5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            ❤️ Quiero Ayudar
          </Link>
        </div>

        <p className="text-sm text-slate-400 pt-4">
          Juntos podemos hacer la diferencia
        </p>
      </div>
    </main>
  );
}