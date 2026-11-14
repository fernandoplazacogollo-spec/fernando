import { useEffect, useState, type FormEvent } from 'react';
import { Building2, RotateCcw, Save } from 'lucide-react';
import type { UserAccount } from '../utils/authLogic';
import type { CompanySettings } from '../utils/hrLogic';
import { GoogleGIcon } from './GoogleChooserModal';

interface SettingsViewProps {
  settings: CompanySettings;
  currentUser: UserAccount;
  onSaveSettings: (next: CompanySettings) => void;
  onResetDemo: () => void;
  onOpenGoogleConnect: () => void;
}

export function SettingsView({
  settings,
  currentUser,
  onSaveSettings,
  onResetDemo,
  onOpenGoogleConnect,
}: SettingsViewProps) {
  const [form, setForm] = useState<CompanySettings>(settings);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...form,
      nombreEmpresa: form.nombreEmpresa.trim() || 'HumanPro S.A.S',
      nit: form.nit.trim() || '900.123.456-7',
    });
  };

  const fullName = `${currentUser.nombre} ${currentUser.apellido}`.trim();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Configuración</h1>
        <p className="mt-1 text-sm text-slate-500">
          Parámetros institucionales de la empresa, horarios laborales y cuenta conectada.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="hp-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              Datos de la Organización
            </h2>
            <p className="text-xs text-slate-500">
              Información legal y jornada estándar aplicada al control de asistencia
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="cfg-empresa"
              className="block text-xs font-semibold text-[#0F172A] mb-1.5"
            >
              Nombre de la empresa
            </label>
            <input
              id="cfg-empresa"
              type="text"
              value={form.nombreEmpresa}
              onChange={(e) => setForm({ ...form, nombreEmpresa: e.target.value })}
              className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="cfg-nit"
              className="block text-xs font-semibold text-[#0F172A] mb-1.5"
            >
              NIT / Identificación tributaria
            </label>
            <input
              id="cfg-nit"
              type="text"
              value={form.nit}
              onChange={(e) => setForm({ ...form, nit: e.target.value })}
              className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm font-tabular"
            />
          </div>

          <div>
            <label
              htmlFor="cfg-entrada"
              className="block text-xs font-semibold text-[#0F172A] mb-1.5"
            >
              Horario de entrada estándar
            </label>
            <input
              id="cfg-entrada"
              type="time"
              value={form.horarioEntrada}
              onChange={(e) => setForm({ ...form, horarioEntrada: e.target.value })}
              className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm font-tabular"
            />
          </div>

          <div>
            <label
              htmlFor="cfg-salida"
              className="block text-xs font-semibold text-[#0F172A] mb-1.5"
            >
              Horario de salida estándar
            </label>
            <input
              id="cfg-salida"
              type="time"
              value={form.horarioSalida}
              onChange={(e) => setForm({ ...form, horarioSalida: e.target.value })}
              className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm font-tabular"
            />
          </div>

          <div>
            <label
              htmlFor="cfg-correo"
              className="block text-xs font-semibold text-[#0F172A] mb-1.5"
            >
              Correo administrativo
            </label>
            <input
              id="cfg-correo"
              type="email"
              value={form.correoAdmin}
              onChange={(e) => setForm({ ...form, correoAdmin: e.target.value })}
              className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="cfg-ciudad"
              className="block text-xs font-semibold text-[#0F172A] mb-1.5"
            >
              Ciudad sede
            </label>
            <input
              id="cfg-ciudad"
              type="text"
              value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
              className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        {/* Cuenta conectada */}
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Cuenta conectada</p>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentUser.provider === 'Google'
                ? `Conectado como ${fullName} · ${currentUser.correo} · Google`
                : `Sesión iniciada con correo: ${currentUser.correo}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenGoogleConnect}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DADCE0] bg-white px-4 py-2 text-xs font-semibold text-[#3C4043] hover:bg-slate-50 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <GoogleGIcon className="h-4 w-4" />
            {currentUser.provider === 'Google'
              ? 'Cambiar cuenta de Google'
              : 'Conectar con Google'}
          </button>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Restablecer datos demo
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-[#FEF3C7] px-3 py-2 text-xs">
                <span className="font-medium text-[#92400E]">¿Reiniciar toda la demo?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetDemo();
                    setConfirmReset(false);
                  }}
                  className="rounded-lg bg-amber-600 px-2.5 py-1 font-semibold text-white hover:bg-amber-700 cursor-pointer"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded-lg px-2 py-1 font-medium text-slate-600 hover:bg-white cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="hp-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4338CA] transition-colors cursor-pointer"
          >
            <Save className="h-4 w-4" />
            Guardar configuración
          </button>
        </div>
      </form>
    </div>
  );
}
