"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const URGENCIAS = [
  { value: "CRITICA", label: "🔴 Crítica - Peligro inmediato" },
  { value: "URGENTE", label: "🟠 Urgente - Necesito pronto" },
  { value: "MODERADA", label: "🟡 Moderada - Puedo esperar" },
];

export default function NecesitoAyuda() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    barrio: "",
    ciudad: "Quibdó",
    telefono: "",
    necesidades: "",
    urgencia: "URGENTE",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ayuda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 2000);
      } else {
        alert("Error al registrar. Intenta de nuevo.");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h1 className="text-2xl font-bold text-slate-900">¡Registro Exitoso!</h1>
          <p className="text-slate-600">Tu solicitud ha sido registrada. Alguien te contactará pronto.</p>
          <p className="text-sm text-slate-400">Redirigiendo...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <button
          onClick={() => router.push("/")}
          className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1"
        >
          ← Volver
        </button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-red-600">🆘 Necesito Ayuda</h1>
          <p className="text-slate-600">Registra tu solicitud para recibir ayuda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre completo *
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Barrio / Vereda *
            </label>
            <input
              name="barrio"
              value={form.barrio}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              placeholder="Ej: Santa Cruz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ciudad
            </label>
            <input
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              placeholder="Quibdó"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Teléfono / WhatsApp
            </label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              placeholder="3xx xxx xxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ¿Qué necesitas? *
            </label>
            <textarea
              name="necesidades"
              value={form.necesidades}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
              placeholder="Ej: Alimentos, agua, medicina, techo..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nivel de urgencia
            </label>
            <select
              name="urgencia"
              value={form.urgencia}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
            >
              {URGENCIAS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded-xl font-semibold text-lg transition-all shadow-lg active:scale-95"
          >
            {loading ? "Registrando..." : "Enviar Solicitud"}
          </button>
        </form>
      </div>
    </main>
  );
}