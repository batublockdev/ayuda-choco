"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white">
            🤝 Ayuda Chocó
          </h1>
          <p className="text-slate-300 text-lg">
            Plataforma solidaria para los afectados del terremoto en Chocó
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Link
            href="/necesito-ayuda"
            className="block w-full py-5 px-6 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xl font-semibold transition-all shadow-lg shadow-rose-600/30 hover:shadow-rose-500/50 active:scale-95"
          >
            🆘 Necesito Ayuda
          </Link>

          <Link
            href="/quiero-ayudar"
            className="block w-full py-5 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xl font-semibold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50 active:scale-95"
          >
            ❤️ Quiero Ayudar
          </Link>
        </div>

        <p className="text-sm text-slate-500 pt-4">
          Juntos podemos hacer la diferencia
        </p>
      </div>
    </main>
  );
}