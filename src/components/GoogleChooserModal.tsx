import { useState, type FormEvent } from 'react';
import { ChevronRight, UserPlus, X } from 'lucide-react';
import { INITIAL_EMPLOYEES } from '../data/seed';
import { Avatar } from './Avatar';

interface GoogleChooserModalProps {
  open: boolean;
  onClose: () => void;
  onSelectGoogleAccount: (profile: {
    nombre: string;
    correo: string;
    foto?: string;
  }) => { ok: boolean; error?: string };
}

export function GoogleGIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-2 14-5.3l-6.5-5.5C29.5 34.8 26.9 36 24 36c-5.2 0-9.5-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.5-2.5 4.6-4.8 6.2l6.5 5.5C39.7 36.4 44 30.7 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}

const GOOGLE_PRESET_ACCOUNTS = [
  {
    nombre: 'Administrador HumanPro',
    correo: 'admin@humanpro.com',
    foto: INITIAL_EMPLOYEES[1]?.foto,
  },
  {
    nombre: 'María González',
    correo: 'maria@humanpro.com',
    foto: INITIAL_EMPLOYEES[0]?.foto,
  },
  {
    nombre: 'Carlos Rodríguez',
    correo: 'carlos@humanpro.com',
    foto: INITIAL_EMPLOYEES[1]?.foto,
  },
];

export function GoogleChooserModal({
  open,
  onClose,
  onSelectGoogleAccount,
}: GoogleChooserModalProps) {
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleClose = () => {
    setCustomMode(false);
    setError(null);
    onClose();
  };

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = onSelectGoogleAccount({
      nombre: customName.trim() || customEmail.split('@')[0] || 'Usuario Google',
      correo: customEmail.trim(),
    });
    if (!res.ok) {
      setError(res.error ?? 'Ingresa un correo de Google válido.');
      return;
    }
    setCustomMode(false);
    setCustomName('');
    setCustomEmail('');
    setError(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-chooser-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-[380px] rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl overflow-hidden">
        <div className="relative p-5 text-center border-b border-[#E2E8F0]">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar selector de Google"
            className="absolute right-3.5 top-3.5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white border border-[#E2E8F0] shadow-xs">
            <GoogleGIcon className="h-6 w-6" />
          </div>
          <h2 id="google-chooser-title" className="mt-2.5 text-lg font-bold text-[#0F172A]">
            Elige una cuenta
          </h2>
          <p className="text-sm text-slate-500">
            para continuar a <strong className="text-[#0F172A]">HumanPro</strong>
          </p>
        </div>

        {!customMode ? (
          <div className="p-2.5 space-y-1">
            {GOOGLE_PRESET_ACCOUNTS.map((acc) => {
              const [first = acc.nombre, ...rest] = acc.nombre.split(' ');
              const last = rest.join(' ');
              return (
                <button
                  key={acc.correo}
                  type="button"
                  onClick={() => {
                    onSelectGoogleAccount(acc);
                    handleClose();
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <Avatar
                    src={acc.foto}
                    nombres={first}
                    apellidos={last}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#0F172A]">
                      {acc.nombre}
                    </p>
                    <p className="truncate text-xs text-slate-500">{acc.correo}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setError(null);
                setCustomMode(true);
              }}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer border-t border-[#F1F5F9] mt-1 pt-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <UserPlus className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0F172A]">Usar otra cuenta</p>
                <p className="text-xs text-slate-500">Inicia sesión con otro correo Gmail</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="p-5 space-y-3.5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="google-custom-name"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Nombre completo
              </label>
              <input
                id="google-custom-name"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Fernando Plaza"
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="google-custom-email"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Correo de Google (Gmail) *
              </label>
              <input
                id="google-custom-email"
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="tunombre@gmail.com"
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCustomMode(false)}
                className="flex-1 rounded-xl border border-[#E2E8F0] bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Volver
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#4F46E5] py-2 text-xs font-semibold text-white hover:bg-[#4338CA] cursor-pointer"
              >
                Continuar
              </button>
            </div>
          </form>
        )}

        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-center text-[11px] text-slate-500">
          Modo selector de cuenta Google para demostración
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="w-full border-t border-[#E2E8F0] bg-white py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
