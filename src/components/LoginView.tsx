import { useRef, useState, type FormEvent } from 'react';
import { Eye, EyeOff, Flame, KeyRound, ShieldCheck, UserPlus, Users, X } from 'lucide-react';
import { FERNANDO_EMAIL, type RegisterAccountInput, type UserAccount } from '../utils/authLogic';
import { getInitials } from '../utils/hrLogic';
import { GoogleGIcon } from './GoogleChooserModal';

interface LoginViewProps {
  accounts: UserAccount[];
  onLogin: (email: string, password: string) => { ok: boolean; error?: string };
  onRegister: (
    input: RegisterAccountInput
  ) => { ok: boolean; errors?: Record<string, string> };
  onResetPassword: (
    email: string,
    newPassword: string
  ) => { ok: boolean; error?: string };
  onOpenGoogleLogin: () => void;
}

export function LoginView({
  accounts,
  onLogin,
  onRegister,
  onResetPassword,
  onOpenGoogleLogin,
}: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [autofillNotice, setAutofillNotice] = useState<string | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  // Registration modal state ("Crear cuenta nueva" - Facebook style)
  const [registerOpen, setRegisterOpen] = useState(false);
  const [regForm, setRegForm] = useState<RegisterAccountInput>({
    nombre: '',
    apellido: '',
    correo: '',
    cargo: 'Gestión RRHH',
    password: '',
    confirmPassword: '',
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [showRegPass, setShowRegPass] = useState(false);

  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSubmitLogin = (e: FormEvent) => {
    e.preventDefault();
    const res = onLogin(email, password);
    if (!res.ok) {
      setLoginError(res.error ?? 'No se pudo iniciar sesión.');
      return;
    }
    setLoginError(null);
    setAutofillNotice(null);
  };

  const handleAutofillFernando = () => {
    setEmail(FERNANDO_EMAIL);
    setPassword('Fernando 1930');
    setLoginError(null);
    setAutofillNotice('Credenciales de Fernando cargadas. Pulsa "Ingresar a HumanPro".');
    window.setTimeout(() => {
      submitButtonRef.current?.focus();
    }, 30);
  };

  const handleQuickLoginFernando = () => {
    setEmail(FERNANDO_EMAIL);
    setPassword('Fernando 1930');
    setAutofillNotice(null);
    const res = onLogin(FERNANDO_EMAIL, 'Fernando 1930');
    if (!res.ok) {
      setLoginError(res.error ?? 'No se pudo iniciar sesión automáticamente.');
      return;
    }
    setLoginError(null);
  };

  const handlePickRecentAccount = (acc: UserAccount) => {
    if (acc.correo.toLowerCase() === FERNANDO_EMAIL) {
      handleQuickLoginFernando();
      return;
    }
    setEmail(acc.correo);
    setPassword('');
    setLoginError(null);
    setAutofillNotice(null);
    window.setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 50);
  };

  const handleFillDemo = () => {
    setEmail('admin@humanpro.com');
    setPassword('123456');
    setLoginError(null);
    setAutofillNotice(null);
  };

  const handleSubmitRegister = (e: FormEvent) => {
    e.preventDefault();
    const res = onRegister(regForm);
    if (!res.ok) {
      setRegErrors(res.errors ?? {});
      return;
    }
    setRegErrors({});
    setRegisterOpen(false);
  };

  const handleSubmitReset = (e: FormEvent) => {
    e.preventDefault();
    const res = onResetPassword(resetEmail, resetNewPass);
    if (!res.ok) {
      setResetError(res.error ?? 'No se pudo restablecer la contraseña.');
      return;
    }
    setResetError(null);
    setEmail(resetEmail.trim().toLowerCase());
    setPassword('');
    setForgotOpen(false);
    setResetEmail('');
    setResetNewPass('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F0F2F5] text-[#0F172A]">
      {/* Main Facebook-style centered split entrance */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-[980px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-12">
          {/* Left Column: Brand + Recent Accounts + 3 Stats + Quick Google CTA */}
          <div className="w-full lg:w-[54%] text-center lg:text-left lg:pt-2">
            <div className="inline-flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#4F46E5]">
                HumanPro
              </span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-[26px] font-normal leading-snug text-[#0F172A] max-w-lg mx-auto lg:mx-0">
              Conecta a tu equipo y gestiona empleados, asistencia y novedades en un solo
              lugar.
            </h1>

            {/* Inicios de sesión recientes */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700 mb-2.5">
                Inicios de sesión recientes
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {accounts.slice(0, 3).map((acc) => {
                  const fullName = `${acc.nombre} ${acc.apellido}`.trim();
                  const isFernando = acc.correo.toLowerCase() === FERNANDO_EMAIL;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handlePickRecentAccount(acc)}
                      className="group w-36 rounded-2xl border border-[#E2E8F0] bg-white p-3 text-left shadow-xs hover:border-[#4F46E5]/50 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF] text-sm font-bold text-[#4F46E5] group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                          {getInitials(acc.nombre, acc.apellido)}
                        </div>
                        {isFernando && (
                          <span className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-orange-700 whitespace-nowrap shrink-0">
                            1 clic
                          </span>
                        )}
                      </div>
                      <p className="mt-2 truncate text-sm font-semibold text-[#0F172A]">
                        {fullName}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">{acc.correo}</p>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setRegErrors({});
                    setRegisterOpen(true);
                  }}
                  className="w-36 rounded-2xl border border-dashed border-[#CBD5E1] bg-white/70 p-3 text-left hover:border-[#4F46E5] hover:bg-white transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#16A34A]">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-[#4F46E5]">Agregar cuenta</p>
                    <p className="text-[11px] text-slate-500">Crear perfil nuevo</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 3 Clean Corporate Stats */}
            <div className="mt-5 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
              <div className="rounded-2xl bg-white border border-[#E2E8F0] px-3.5 py-2.5 shadow-xs text-left">
                <p className="text-xl font-bold text-[#0F172A] font-tabular">128</p>
                <p className="text-xs font-medium text-slate-500">Empleados</p>
              </div>
              <div className="rounded-2xl bg-white border border-[#E2E8F0] px-3.5 py-2.5 shadow-xs text-left">
                <p className="text-xl font-bold text-[#16A34A] font-tabular">98%</p>
                <p className="text-xs font-medium text-slate-500">Asistencia</p>
              </div>
              <div className="rounded-2xl bg-white border border-[#E2E8F0] px-3.5 py-2.5 shadow-xs text-left">
                <p className="text-xl font-bold text-[#4F46E5] font-tabular">4</p>
                <p className="text-xs font-medium text-slate-500">Departamentos</p>
              </div>
            </div>

            {/* Quick Google Entry Pill on Desktop */}
            <button
              type="button"
              onClick={onOpenGoogleLogin}
              className="hidden lg:inline-flex mt-5 items-center gap-2.5 rounded-xl border border-[#DADCE0] bg-white px-4 py-2.5 text-sm font-semibold text-[#3C4043] shadow-xs hover:bg-slate-50 hover:shadow-md transition-all cursor-pointer"
            >
              <GoogleGIcon className="h-5 w-5" />
              Entrar rápido con Google
            </button>
          </div>

          {/* Right Column: Iconic Elevated White Login Card with Google + Email/Password */}
          <div className="w-full max-w-[396px] shrink-0">
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-xl shadow-slate-900/10 border border-[#E2E8F0]">
              {/* White Google Sign-In Button */}
              <button
                type="button"
                onClick={onOpenGoogleLogin}
                className="hp-focus-ring w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#DADCE0] bg-white px-4 py-3 text-[15px] font-semibold text-[#3C4043] hover:bg-[#F8F9FA] hover:shadow-sm transition-all cursor-pointer"
              >
                <GoogleGIcon className="h-5 w-5" />
                Continuar con Google
              </button>
              <p className="mt-2 text-center text-[11px] text-slate-400">
                Usa tu cuenta de Gmail, sin contraseña
              </p>

              {/* Divider "o" */}
              <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px flex-1 bg-[#E2E8F0]" />
                <span>o</span>
                <span className="h-px flex-1 bg-[#E2E8F0]" />
              </div>

              {loginError && (
                <div
                  role="alert"
                  className="mb-3.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
                >
                  {loginError}
                </div>
              )}

              {autofillNotice && (
                <div
                  role="status"
                  className="mb-3.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-800"
                >
                  {autofillNotice}
                </div>
              )}

              <form onSubmit={handleSubmitLogin} className="space-y-3">
                <div>
                  <label htmlFor="login-email" className="sr-only">
                    Correo electrónico
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    aria-label="Correo electrónico"
                    autoComplete="email"
                    className="hp-input w-full rounded-xl px-4 py-3 text-[15px]"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="login-password" className="sr-only">
                    Contraseña
                  </label>
                  <input
                    ref={passwordInputRef}
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    aria-label="Contraseña"
                    autoComplete="current-password"
                    className="hp-input w-full rounded-xl py-3 pl-4 pr-11 text-[15px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>

                <button
                  ref={submitButtonRef}
                  type="submit"
                  className="hp-focus-ring w-full rounded-xl bg-[#4F46E5] px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors cursor-pointer"
                >
                  Ingresar a HumanPro
                </button>
              </form>

              <button
                type="button"
                onClick={handleAutofillFernando}
                className="hp-focus-ring mt-2.5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-orange-700 transition-colors cursor-pointer"
              >
                <Flame className="h-4 w-4" />
                Acceso Rápido
              </button>

              <div className="mt-3.5 flex items-center justify-between text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetError(null);
                    setForgotOpen(true);
                  }}
                  className="font-medium text-[#4F46E5] hover:underline cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>

                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="font-medium text-slate-500 hover:text-[#0F172A] cursor-pointer"
                >
                  Usar cuenta demo
                </button>
              </div>

              <hr className="my-5 border-[#E2E8F0]" />

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setRegErrors({});
                    setRegisterOpen(true);
                  }}
                  className="hp-focus-ring rounded-xl bg-[#16A34A] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#15803D] transition-colors cursor-pointer"
                >
                  Crear cuenta nueva
                </button>
              </div>
            </div>

            <p className="mt-5 text-center text-xs sm:text-[13px] text-slate-600">
              <strong className="font-semibold text-[#0F172A]">HumanPro S.A.S</strong> ·
              Demo: <span className="font-mono">admin@humanpro.com</span> /{' '}
              <span className="font-mono">123456</span>
            </p>
          </div>
        </div>
      </main>

      {/* Crisp Facebook-style White Bottom Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] px-6 py-5 text-xs text-slate-500">
        <div className="max-w-[980px] mx-auto space-y-2.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-medium text-slate-700">Español (Colombia)</span>
            <span>Bogotá D.C.</span>
            <span>NIT 900.123.456-7</span>
          </div>
          <div className="border-t border-[#F1F5F9] pt-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Dashboard</span>
              <span>Empleados</span>
              <span>Departamentos</span>
              <span>Cargos</span>
              <span>Asistencia</span>
              <span>Novedades</span>
              <span>Reportes</span>
            </div>
            <span>HumanPro © 2026</span>
          </div>
        </div>
      </footer>

      {/* Modal: Crear cuenta nueva (Facebook-style registration card + Google button) */}
      {registerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] px-6 py-4">
              <div>
                <h2 id="register-modal-title" className="text-xl font-bold text-[#0F172A]">
                  Crear cuenta nueva
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regístrate con Google o con tu correo y contraseña.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRegisterOpen(false)}
                aria-label="Cerrar registro"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <button
                type="button"
                onClick={() => {
                  setRegisterOpen(false);
                  onOpenGoogleLogin();
                }}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#DADCE0] bg-white px-4 py-2.5 text-sm font-semibold text-[#3C4043] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
              >
                <GoogleGIcon className="h-4.5 w-4.5" />
                Registrarte con Google
              </button>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px flex-1 bg-[#E2E8F0]" />
                <span>o con correo</span>
                <span className="h-px flex-1 bg-[#E2E8F0]" />
              </div>

              <form onSubmit={handleSubmitRegister} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-nombre"
                      className="block text-xs font-semibold text-[#0F172A] mb-1"
                    >
                      Nombre *
                    </label>
                    <input
                      id="reg-nombre"
                      type="text"
                      value={regForm.nombre}
                      onChange={(e) => setRegForm({ ...regForm, nombre: e.target.value })}
                      placeholder="Fernando"
                      className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                    />
                    {regErrors.nombre && (
                      <p className="mt-1 text-xs text-red-600">{regErrors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-apellido"
                      className="block text-xs font-semibold text-[#0F172A] mb-1"
                    >
                      Apellido *
                    </label>
                    <input
                      id="reg-apellido"
                      type="text"
                      value={regForm.apellido}
                      onChange={(e) =>
                        setRegForm({ ...regForm, apellido: e.target.value })
                      }
                      placeholder="Plaza"
                      className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                    />
                    {regErrors.apellido && (
                      <p className="mt-1 text-xs text-red-600">{regErrors.apellido}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-correo"
                    className="block text-xs font-semibold text-[#0F172A] mb-1"
                  >
                    Correo electrónico *
                  </label>
                  <input
                    id="reg-correo"
                    type="email"
                    value={regForm.correo}
                    onChange={(e) => setRegForm({ ...regForm, correo: e.target.value })}
                    placeholder="tucorreo@empresa.com"
                    className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                  />
                  {regErrors.correo && (
                    <p className="mt-1 text-xs text-red-600">{regErrors.correo}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-cargo"
                    className="block text-xs font-semibold text-[#0F172A] mb-1"
                  >
                    Cargo / Área
                  </label>
                  <input
                    id="reg-cargo"
                    type="text"
                    value={regForm.cargo}
                    onChange={(e) => setRegForm({ ...regForm, cargo: e.target.value })}
                    placeholder="Director de Talento Humano"
                    className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-semibold text-[#0F172A] mb-1"
                  >
                    Contraseña nueva * (mín. 6 caracteres)
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showRegPass ? 'text' : 'password'}
                      value={regForm.password}
                      onChange={(e) =>
                        setRegForm({ ...regForm, password: e.target.value })
                      }
                      placeholder="••••••"
                      className="hp-input w-full rounded-xl py-2.5 pl-3.5 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPass((prev) => !prev)}
                      aria-label={showRegPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showRegPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {regErrors.password && (
                    <p className="mt-1 text-xs text-red-600">{regErrors.password}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-confirm"
                    className="block text-xs font-semibold text-[#0F172A] mb-1"
                  >
                    Confirmar contraseña *
                  </label>
                  <input
                    id="reg-confirm"
                    type={showRegPass ? 'text' : 'password'}
                    value={regForm.confirmPassword}
                    onChange={(e) =>
                      setRegForm({ ...regForm, confirmPassword: e.target.value })
                    }
                    placeholder="••••••"
                    className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                  />
                  {regErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {regErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="hp-focus-ring w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#15803D] transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Crear cuenta e ingresar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Recuperar / Restablecer contraseña */}
      {forgotOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
                  <KeyRound className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h2 id="forgot-modal-title" className="text-base font-bold text-[#0F172A]">
                    Restablecer contraseña
                  </h2>
                  <p className="text-xs text-slate-500">
                    Actualiza la clave de una cuenta registrada
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                aria-label="Cerrar recuperación"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReset} className="p-6 space-y-4">
              {resetError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                  {resetError}
                </div>
              )}

              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-xs font-semibold text-[#0F172A] mb-1"
                >
                  Correo de la cuenta *
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="tucorreo@empresa.com"
                  className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="reset-password"
                  className="block text-xs font-semibold text-[#0F172A] mb-1"
                >
                  Nueva contraseña * (mín. 6 caracteres)
                </label>
                <input
                  id="reset-password"
                  type="password"
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                  placeholder="••••••"
                  className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338CA] cursor-pointer"
                >
                  Actualizar contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
