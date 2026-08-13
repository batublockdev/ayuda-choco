"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Verificacion {
  id: string;
  ayudaId: string;
  nombre: string;
  estrellas: number;
  comentario: string;
  createdAt: string;
}

interface Ayuda {
  id: string;
  nombre: string;
  barrio: string;
  municipio: string;
  telefono: string | null;
  necesidades: string;
  urgencia: "CRITICA" | "URGENTE" | "MODERADA";
  ayudado: boolean;
  verificaciones?: Verificacion[];
  createdAt: string;
}

const URGENCIA_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CRITICA: { bg: "bg-rose-500/15", text: "text-rose-400", label: "🔴 Crítica" },
  URGENTE: { bg: "bg-orange-500/15", text: "text-orange-400", label: "🟠 Urgente" },
  MODERADA: { bg: "bg-amber-500/15", text: "text-amber-400", label: "🟡 Moderada" },
};

function Stars({ count, size = "text-sm" }: { count: number; size?: string }) {
  return (
    <span className={size}>
      <span className="text-amber-400">{"★".repeat(count)}</span>
      <span className="text-slate-600">{"★".repeat(5 - count)}</span>
    </span>
  );
}

export default function QuieroAyudar() {
  const router = useRouter();
  const [ayudas, setAyudas] = useState<Ayuda[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("TODAS");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [verifForm, setVerifForm] = useState({ nombre: "", estrellas: 5, comentario: "" });

  useEffect(() => {
    fetchAyudas();
  }, []);

  const fetchAyudas = async () => {
    try {
      const res = await fetch("/api/ayuda");
      const data = await res.json();
      setAyudas(data);
    } catch {
      console.error("Error");
    } finally {
      setLoading(false);
    }
  };

  const marcarAyudado = async (id: string) => {
    try {
      await fetch(`/api/ayuda/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ayudado: true }),
      });
      fetchAyudas();
    } catch {
      alert("Error al actualizar");
    }
  };

  const submitVerificacion = async (ayudaId: string) => {
    if (!verifForm.nombre || !verifForm.comentario) {
      alert("Nombre y comentario son obligatorios");
      return;
    }
    setVerificando(true);
    try {
      const res = await fetch("/api/verificacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...verifForm, ayudaId }),
      });
      if (res.ok) {
        setVerifForm({ nombre: "", estrellas: 5, comentario: "" });
        fetchAyudas();
      } else {
        alert("Error al enviar verificación");
      }
    } catch {
      alert("Error de conexión");
    }
    setVerificando(false);
  };

  const promedioEstrellas = (verifs: Verificacion[] | undefined) => {
    if (!verifs || verifs.length === 0) return 0;
    const total = verifs.reduce((sum, v) => sum + v.estrellas, 0);
    return Math.round((total / verifs.length) * 10) / 10;
  };

  const ayudasFiltradas =
    filtro === "TODAS"
      ? ayudas
      : filtro === "AYUDADAS"
      ? ayudas.filter((a) => a.ayudado)
      : ayudas.filter((a) => !a.ayudado);

  const pendientes = ayudas.filter((a) => !a.ayudado).length;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-3">
          <div className="animate-spin text-5xl">⏳</div>
          <p className="text-slate-400">Cargando solicitudes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.push("/")}
          className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
        >
          ← Volver
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-400">❤️ Quiero Ayudar</h1>
          <p className="text-slate-400">
            {pendientes} {pendientes === 1 ? "persona necesita" : "personas necesitan"} ayuda ahora mismo
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 justify-center">
          {[
            { value: "PENDIENTES", label: "Pendientes" },
            { value: "TODAS", label: "Todas" },
            { value: "AYUDADAS", label: "Ayudadas" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filtro === f.value
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30"
                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {ayudasFiltradas.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-5xl">🙏</div>
            <p className="text-slate-500">
              {ayudas.length === 0
                ? "Aún no hay solicitudes registradas. Compártelo para que más gente se entere."
                : "No hay solicitudes en este filtro."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ayudasFiltradas.map((ayuda) => {
              const estilo = URGENCIA_STYLES[ayuda.urgencia];
              const verifs = ayuda.verificaciones || [];
              const promedio = promedioEstrellas(verifs);
              const isExpanded = expandedId === ayuda.id;

              return (
                <div
                  key={ayuda.id}
                  className={`bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden ${
                    ayuda.ayudado ? "opacity-50" : ""
                  }`}
                >
                  <div className="p-5 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-white text-lg">
                          {ayuda.nombre}
                        </h3>
                        <p className="text-sm text-slate-400">
                          📍 {ayuda.barrio}, {ayuda.municipio}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${estilo.bg} ${estilo.text}`}>
                        {estilo.label}
                      </span>
                    </div>

                    {/* Verificación promedio */}
                    {verifs.length > 0 && (
                      <div className="flex items-center gap-2 bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
                        <span className="text-amber-400 text-lg font-bold">{promedio.toFixed(1)}</span>
                        <Stars count={Math.round(promedio)} size="text-base" />
                        <span className="text-xs text-slate-400">
                          ({verifs.length} {verifs.length === 1 ? "verificación" : "verificaciones"})
                        </span>
                      </div>
                    )}

                    {/* Necesidades */}
                    <div className="bg-slate-800 rounded-xl p-3 border border-slate-700/50">
                      <p className="text-xs font-medium text-slate-500 mb-1">NECESIDADES</p>
                      <p className="text-slate-200">{ayuda.necesidades}</p>
                    </div>

                    {/* Contacto */}
                    {ayuda.telefono && (
                      <a
                        href={`https://wa.me/57${ayuda.telefono.replace(/\s/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-center font-medium text-sm transition-colors border border-emerald-500/20"
                      >
                        📱 Contactar por WhatsApp: {ayuda.telefono}
                      </a>
                    )}

                    {/* Estado */}
                    {ayuda.ayudado ? (
                      <div className="flex items-center justify-center gap-2 py-2 text-emerald-400 font-medium">
                        ✅ Ayuda entregada
                      </div>
                    ) : (
                      <button
                        onClick={() => marcarAyudado(ayuda.id)}
                        className="w-full py-2.5 px-4 bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-700"
                      >
                        Marcar como ayudado ✓
                      </button>
                    )}

                    {/* Verificación toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ayuda.id)}
                      className="w-full py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-amber-500/20"
                    >
                      ⭐ {isExpanded ? "Ocultar verificaciones" : "Verificar / Ver verificaciones"}
                      {verifs.length > 0 && (
                        <span className="bg-amber-500/20 text-amber-300 rounded-full px-2 py-0.5 text-xs">
                          {verifs.length}
                        </span>
                      )}
                    </button>

                    {/* Verificaciones expandidas */}
                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        {/* Lista de verificaciones */}
                        {verifs.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-slate-500">VERIFICACIONES</p>
                            {verifs.map((v) => (
                              <div key={v.id} className="bg-slate-800 rounded-xl p-3 space-y-1 border border-slate-700/50">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm text-slate-200">{v.nombre}</span>
                                  <Stars count={v.estrellas} />
                                </div>
                                <p className="text-sm text-slate-400">{v.comentario}</p>
                                <p className="text-xs text-slate-600">
                                  {new Date(v.createdAt).toLocaleDateString("es-CO", {
                                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Formulario de verificación */}
                        <div className="bg-amber-500/5 rounded-xl p-4 space-y-3 border border-amber-500/20">
                          <p className="text-sm font-medium text-amber-400">✓ Verificar a esta persona</p>
                          <p className="text-xs text-slate-400">¿Conoces a esta persona? ¿Es real su solicitud? Comparte tu experiencia.</p>
                          
                          <input
                            type="text"
                            placeholder="Tu nombre"
                            value={verifForm.nombre}
                            onChange={(e) => setVerifForm({ ...verifForm, nombre: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
                          />

                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Estrellas (1-5)</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => setVerifForm({ ...verifForm, estrellas: n })}
                                  className={`text-2xl transition-transform hover:scale-110 ${
                                    n <= verifForm.estrellas ? "text-amber-400" : "text-slate-700"
                                  }`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            placeholder="Ej: Conozco a esta persona, vive en el barrio y realmente necesita ayuda..."
                            value={verifForm.comentario}
                            onChange={(e) => setVerifForm({ ...verifForm, comentario: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm outline-none focus:ring-2 focus:ring-amber-400 resize-none transition-colors"
                          />

                          <button
                            onClick={() => submitVerificacion(ayuda.id)}
                            disabled={verificando}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 rounded-xl text-sm font-medium transition-colors"
                          >
                            {verificando ? "Enviando..." : "Enviar verificación"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Fecha */}
                    <p className="text-xs text-slate-600 text-right">
                      {new Date(ayuda.createdAt).toLocaleDateString("es-CO", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}