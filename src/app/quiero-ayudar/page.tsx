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
  ciudad: string;
  telefono: string | null;
  necesidades: string;
  urgencia: "CRITICA" | "URGENTE" | "MODERADA";
  ayudado: boolean;
  verificaciones?: Verificacion[];
  createdAt: string;
}

const URGENCIA_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CRITICA: { bg: "bg-red-100", text: "text-red-700", label: "🔴 Crítica" },
  URGENTE: { bg: "bg-orange-100", text: "text-orange-700", label: "🟠 Urgente" },
  MODERADA: { bg: "bg-yellow-100", text: "text-yellow-700", label: "🟡 Moderada" },
};

function Stars({ count, size = "text-sm" }: { count: number; size?: string }) {
  return (
    <span className={size}>
      {"★".repeat(count)}
      <span className="text-slate-300">{"★".repeat(5 - count)}</span>
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
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="animate-spin text-5xl">⏳</div>
          <p className="text-slate-600">Cargando solicitudes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.push("/")}
          className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
        >
          ← Volver
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-emerald-600">❤️ Quiero Ayudar</h1>
          <p className="text-slate-600">
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
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
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
                  className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${
                    ayuda.ayudado ? "opacity-60" : ""
                  }`}
                >
                  <div className="p-5 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-slate-900 text-lg">
                          {ayuda.nombre}
                        </h3>
                        <p className="text-sm text-slate-500">
                          📍 {ayuda.barrio}, {ayuda.ciudad}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${estilo.bg} ${estilo.text}`}>
                        {estilo.label}
                      </span>
                    </div>

                    {/* Verificación promedio */}
                    {verifs.length > 0 && (
                      <div className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
                        <span className="text-amber-500 text-lg font-bold">{promedio.toFixed(1)}</span>
                        <Stars count={Math.round(promedio)} size="text-base" />
                        <span className="text-xs text-slate-500">
                          ({verifs.length} {verifs.length === 1 ? "verificación" : "verificaciones"})
                        </span>
                      </div>
                    )}

                    {/* Necesidades */}
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-slate-500 mb-1">NECESIDADES</p>
                      <p className="text-slate-800">{ayuda.necesidades}</p>
                    </div>

                    {/* Contacto */}
                    {ayuda.telefono && (
                      <a
                        href={`https://wa.me/57${ayuda.telefono.replace(/\s/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-center font-medium text-sm transition-colors"
                      >
                        📱 Contactar por WhatsApp: {ayuda.telefono}
                      </a>
                    )}

                    {/* Estado */}
                    {ayuda.ayudado ? (
                      <div className="flex items-center justify-center gap-2 py-2 text-emerald-600 font-medium">
                        ✅ Ayuda entregada
                      </div>
                    ) : (
                      <button
                        onClick={() => marcarAyudado(ayuda.id)}
                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 rounded-xl text-sm font-medium transition-colors"
                      >
                        Marcar como ayudado ✓
                      </button>
                    )}

                    {/* Verificación toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ayuda.id)}
                      className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      ⭐ {isExpanded ? "Ocultar verificaciones" : "Verificar / Ver verificaciones"}
                      {verifs.length > 0 && (
                        <span className="bg-amber-200 text-amber-800 rounded-full px-2 py-0.5 text-xs">
                          {verifs.length}
                        </span>
                      )}
                    </button>

                    {/* Verificaciones expandidas */}
                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        {/* Lista de verificaciones */}
                        {verifs.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-slate-500">VERIFICACIONES</p>
                            {verifs.map((v) => (
                              <div key={v.id} className="bg-slate-50 rounded-xl p-3 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm text-slate-700">{v.nombre}</span>
                                  <Stars count={v.estrellas} />
                                </div>
                                <p className="text-sm text-slate-600">{v.comentario}</p>
                                <p className="text-xs text-slate-400">
                                  {new Date(v.createdAt).toLocaleDateString("es-CO", {
                                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Formulario de verificación */}
                        <div className="bg-amber-50 rounded-xl p-4 space-y-3">
                          <p className="text-sm font-medium text-amber-800">✓ Verificar a esta persona</p>
                          <p className="text-xs text-slate-500">¿Conoces a esta persona? ¿Es real su solicitud? Comparte tu experiencia.</p>
                          
                          <input
                            type="text"
                            placeholder="Tu nombre"
                            value={verifForm.nombre}
                            onChange={(e) => setVerifForm({ ...verifForm, nombre: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                          />

                          <div>
                            <label className="block text-xs text-slate-600 mb-1">Estrellas (1-5)</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => setVerifForm({ ...verifForm, estrellas: n })}
                                  className={`text-2xl transition-transform hover:scale-110 ${
                                    n <= verifForm.estrellas ? "text-amber-400" : "text-slate-300"
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
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                          />

                          <button
                            onClick={() => submitVerificacion(ayuda.id)}
                            disabled={verificando}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 text-white rounded-xl text-sm font-medium transition-colors"
                          >
                            {verificando ? "Enviando..." : "Enviar verificación"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Fecha */}
                    <p className="text-xs text-slate-400 text-right">
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