"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-stone-100 to-stone-200 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-stone-900">
            🤝 Ayuda Chocó
          </h1>
          <p className="text-stone-600 text-lg">
            Plataforma solidaria para los afectados del terremoto en Chocó
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Link
            href="/necesito-ayuda"
            className="block w-full py-5 px-6 bg-red-700 hover:bg-red-800 text-white rounded-2xl text-xl font-semibold transition-all shadow-lg shadow-red-700/30 hover:shadow-red-700/50 active:scale-95"
          >
            🆘 Necesito Ayuda
          </Link>

          <Link
            href="/quiero-ayudar"
            className="block w-full py-5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xl font-semibold transition-all shadow-lg shadow-emerald-700/30 hover:shadow-emerald-700/50 active:scale-95"
          >
            ❤️ Quiero Ayudar
          </Link>
        </div>

        <p className="text-sm text-stone-500 pt-4">
          Juntos podemos hacer la diferencia
        </p>
      </div>
    </main>
  );
}