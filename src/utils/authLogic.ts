export type AuthProviderType = 'Email' | 'Google';

export interface UserAccount {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  passwordHash: string;
  createdAt: string;
  provider?: AuthProviderType;
  foto?: string;
  isDemo?: boolean;
}

export interface RegisterAccountInput {
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  password: string;
  confirmPassword: string;
}

export interface AuthValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const ACCOUNTS_STORAGE_KEY = 'humanpro_accounts_v1';
const SESSION_STORAGE_KEY = 'humanpro_active_session_v1';

/**
 * Synchronous deterministic salted hash (FNV-1a 64-bit style mixing) so passwords
 * are never stored in plain text in localStorage and work identically in browser & Node tests.
 */
export function hashPassword(password: string, salt = 'hp-saas-2026'): string {
  const input = `${salt}:${password}`;
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `hp$${(h2 >>> 0).toString(16).padStart(8, '0')}${(h1 >>> 0).toString(16).padStart(8, '0')}`;
}

export const FERNANDO_EMAIL = 'fernandoplazacogollo@gmail.com';

export function getSeedAccounts(): UserAccount[] {
  return [
    {
      id: 'acc-fernando-vip',
      nombre: 'Fernando',
      apellido: 'Plaza',
      correo: FERNANDO_EMAIL,
      cargo: 'Free Fire & RRHH',
      passwordHash: hashPassword('Fernando 1930'),
      createdAt: '2026-01-01',
      provider: 'Email',
      isDemo: true,
    },
    {
      id: 'acc-admin-demo',
      nombre: 'Administrador',
      apellido: 'RRHH',
      correo: 'admin@humanpro.com',
      cargo: 'Talento Humano',
      passwordHash: hashPassword('123456'),
      createdAt: '2026-01-01',
      provider: 'Email',
      isDemo: true,
    },
  ];
}

export function ensureSeedAccounts(existingAccounts: UserAccount[]): UserAccount[] {
  const seeds = getSeedAccounts();
  let next = [...existingAccounts];

  for (const seed of seeds) {
    const idx = next.findIndex(
      (acc) => acc.correo.toLowerCase() === seed.correo.toLowerCase()
    );
    if (idx === -1) {
      next = [seed, ...next];
    } else if (
      seed.correo.toLowerCase() === FERNANDO_EMAIL &&
      next[idx].cargo === 'Cuenta Google'
    ) {
      // Ensure pre-existing Google-only entry for Fernando also accepts his password directly
      next[idx] = {
        ...next[idx],
        passwordHash: seed.passwordHash,
        cargo: seed.cargo,
      };
    }
  }

  return next;
}

export function getDefaultPageForAccount(
  account: UserAccount | null | undefined
): 'dashboard' | 'freefire' {
  if (!account) return 'dashboard';
  return account.correo.toLowerCase() === FERNANDO_EMAIL ? 'freefire' : 'dashboard';
}

export function validateRegistrationInput(
  input: RegisterAccountInput,
  existingAccounts: UserAccount[]
): AuthValidationResult {
  const errors: Record<string, string> = {};
  const cleanEmail = input.correo.trim().toLowerCase();

  if (!input.nombre.trim()) {
    errors.nombre = 'Ingresa tu nombre.';
  }
  if (!input.apellido.trim()) {
    errors.apellido = 'Ingresa tu apellido.';
  }
  if (!cleanEmail) {
    errors.correo = 'El correo electrónico es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    errors.correo = 'Ingresa un correo electrónico válido.';
  } else if (existingAccounts.some((acc) => acc.correo.toLowerCase() === cleanEmail)) {
    errors.correo = 'Ya existe una cuenta registrada con este correo.';
  }

  if (!input.password) {
    errors.password = 'Crea una contraseña.';
  } else if (input.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  if (!input.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña.';
  } else if (input.password !== input.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function registerAccount(
  existingAccounts: UserAccount[],
  input: RegisterAccountInput
): {
  ok: boolean;
  accounts: UserAccount[];
  created?: UserAccount;
  errors?: Record<string, string>;
} {
  const validation = validateRegistrationInput(input, existingAccounts);
  if (!validation.valid) {
    return {
      ok: false,
      accounts: existingAccounts,
      errors: validation.errors,
    };
  }

  const created: UserAccount = {
    id: `acc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    nombre: input.nombre.trim(),
    apellido: input.apellido.trim(),
    correo: input.correo.trim().toLowerCase(),
    cargo: input.cargo.trim() || 'Gestión RRHH',
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString().slice(0, 10),
    provider: 'Email',
  };

  return {
    ok: true,
    accounts: [created, ...existingAccounts],
    created,
  };
}

export function authenticateAccount(
  accounts: UserAccount[],
  email: string,
  password: string
): { ok: boolean; account?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { ok: false, error: 'Ingresa tu correo electrónico.' };
  }
  if (!password) {
    return { ok: false, error: 'Ingresa tu contraseña.' };
  }

  const match = accounts.find((acc) => acc.correo.toLowerCase() === cleanEmail);
  if (!match) {
    return {
      ok: false,
      error: 'No encontramos una cuenta con ese correo. Puedes crear una cuenta nueva.',
    };
  }

  if (match.passwordHash !== hashPassword(password)) {
    return {
      ok: false,
      error: 'Contraseña incorrecta. Verifica tus datos e intenta nuevamente.',
    };
  }

  return { ok: true, account: match };
}

export function loginOrCreateGoogleAccount(
  existingAccounts: UserAccount[],
  profile: { nombre: string; apellido?: string; correo: string; foto?: string }
): { ok: boolean; accounts: UserAccount[]; account?: UserAccount; error?: string } {
  const cleanEmail = profile.correo.trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return {
      ok: false,
      accounts: existingAccounts,
      error: 'Ingresa un correo electrónico válido de Google.',
    };
  }

  const parts = profile.nombre.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || 'Usuario';
  const lastName =
    profile.apellido?.trim() || (parts.length > 1 ? parts.slice(1).join(' ') : 'Google');

  const existing = existingAccounts.find((acc) => acc.correo.toLowerCase() === cleanEmail);
  if (existing) {
    const updated: UserAccount = {
      ...existing,
      provider: 'Google',
      foto: profile.foto ?? existing.foto,
    };
    return {
      ok: true,
      accounts: existingAccounts.map((acc) => (acc.id === existing.id ? updated : acc)),
      account: updated,
    };
  }

  const created: UserAccount = {
    id: `acc-google-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    nombre: firstName,
    apellido: lastName,
    correo: cleanEmail,
    cargo: 'Cuenta Google',
    passwordHash: hashPassword(`google-${Date.now()}`),
    createdAt: new Date().toISOString().slice(0, 10),
    provider: 'Google',
    foto: profile.foto,
  };

  return {
    ok: true,
    accounts: [created, ...existingAccounts],
    account: created,
  };
}

export function resetAccountPassword(
  accounts: UserAccount[],
  email: string,
  newPassword: string
): { ok: boolean; accounts: UserAccount[]; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { ok: false, accounts, error: 'Ingresa el correo de tu cuenta.' };
  }
  if (newPassword.length < 6) {
    return {
      ok: false,
      accounts,
      error: 'La nueva contraseña debe tener al menos 6 caracteres.',
    };
  }

  const exists = accounts.some((acc) => acc.correo.toLowerCase() === cleanEmail);
  if (!exists) {
    return {
      ok: false,
      accounts,
      error: 'No existe ninguna cuenta registrada con ese correo.',
    };
  }

  const next = accounts.map((acc) =>
    acc.correo.toLowerCase() === cleanEmail
      ? { ...acc, passwordHash: hashPassword(newPassword) }
      : acc
  );

  return { ok: true, accounts: next };
}

export function loadStoredAccounts(): UserAccount[] {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return getSeedAccounts();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getSeedAccounts();
    }
    return ensureSeedAccounts(parsed as UserAccount[]);
  } catch {
    return getSeedAccounts();
  }
}

export function saveStoredAccounts(accounts: UserAccount[]): void {
  try {
    window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadActiveSessionUser(accounts: UserAccount[]): UserAccount | null {
  try {
    const rawId = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!rawId) return null;
    return accounts.find((acc) => acc.id === rawId) ?? null;
  } catch {
    return null;
  }
}

export function saveActiveSessionUser(userId: string | null): void {
  try {
    if (!userId) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      window.localStorage.setItem(SESSION_STORAGE_KEY, userId);
    }
  } catch {
    // Ignore storage errors
  }
}
