import mariaAvatar from '../assets/images/avatar_maria_gonzalez_1794684064947.jpg';
import carlosAvatar from '../assets/images/avatar_carlos_rodriguez_1794684065401.jpg';
import anaAvatar from '../assets/images/avatar_ana_martinez_1794684065290.jpg';
import joseAvatar from '../assets/images/avatar_jose_perez_1794684065484.jpg';
import lauraAvatar from '../assets/images/avatar_laura_lopez_1794684066327.jpg';

import type {
  ActivityItem,
  AttendanceRecord,
  CompanySettings,
  Department,
  Employee,
  Novedad,
  RolePosition,
} from '../utils/hrLogic';

export interface HrAppState {
  employees: Employee[];
  departments: Department[];
  roles: RolePosition[];
  attendance: AttendanceRecord[];
  novedades: Novedad[];
  activities: ActivityItem[];
  settings: CompanySettings;
}

export const DEFAULT_AVATAR = carlosAvatar;

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    documento: '1098765432',
    nombres: 'María',
    apellidos: 'González',
    correo: 'maria@humanpro.com',
    telefono: '310 452 8891',
    cargo: 'Desarrollador Senior',
    departamento: 'Tecnología',
    fechaIngreso: '2023-02-15',
    tipoContrato: 'Indefinido',
    salario: 4200000,
    estado: 'Activo',
    foto: mariaAvatar,
  },
  {
    id: 2,
    documento: '1098765433',
    nombres: 'Carlos',
    apellidos: 'Rodríguez',
    correo: 'carlos@humanpro.com',
    telefono: '312 884 1029',
    cargo: 'Analista RRHH',
    departamento: 'Talento Humano',
    fechaIngreso: '2024-01-10',
    tipoContrato: 'Indefinido',
    salario: 2600000,
    estado: 'Activo',
    foto: carlosAvatar,
  },
  {
    id: 3,
    documento: '1098765434',
    nombres: 'Ana',
    apellidos: 'Martínez',
    correo: 'ana@humanpro.com',
    telefono: '301 774 3320',
    cargo: 'Ejecutivo Ventas',
    departamento: 'Ventas',
    fechaIngreso: '2024-05-20',
    tipoContrato: 'Indefinido',
    salario: 2400000,
    estado: 'Activo',
    foto: anaAvatar,
  },
  {
    id: 4,
    documento: '1098765435',
    nombres: 'José',
    apellidos: 'Pérez',
    correo: 'jose@humanpro.com',
    telefono: '315 620 4118',
    cargo: 'Contador',
    departamento: 'Finanzas',
    fechaIngreso: '2022-09-01',
    tipoContrato: 'Indefinido',
    salario: 3200000,
    estado: 'Activo',
    foto: joseAvatar,
  },
  {
    id: 5,
    documento: '1098765436',
    nombres: 'Laura',
    apellidos: 'López',
    correo: 'laura@humanpro.com',
    telefono: '320 918 2245',
    cargo: 'Desarrollador Junior',
    departamento: 'Tecnología',
    fechaIngreso: '2025-03-01',
    tipoContrato: 'Indefinido',
    salario: 2500000,
    estado: 'Activo',
    foto: lauraAvatar,
  },
  {
    id: 6,
    documento: '1098765437',
    nombres: 'Diego',
    apellidos: 'Torres',
    correo: 'diego@humanpro.com',
    telefono: '318 339 7640',
    cargo: 'Diseñador UX',
    departamento: 'Tecnología',
    fechaIngreso: '2024-08-12',
    tipoContrato: 'Fijo',
    salario: 3000000,
    estado: 'Inactivo',
  },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-tech',
    nombre: 'Tecnología',
    descripcion: 'Desarrollo de software, UX y soporte técnico',
    lider: 'María González',
    baseCount: 42,
    seedRosterCount: 3,
    accentColor: 'indigo',
  },
  {
    id: 'dept-rrhh',
    nombre: 'Talento Humano',
    descripcion: 'Gestión de personal, selección y bienestar',
    lider: 'Carlos Rodríguez',
    baseCount: 12,
    seedRosterCount: 1,
    accentColor: 'emerald',
  },
  {
    id: 'dept-ventas',
    nombre: 'Ventas',
    descripcion: 'Gestión comercial, prospección y clientes clave',
    lider: 'Ana Martínez',
    baseCount: 38,
    seedRosterCount: 1,
    accentColor: 'amber',
  },
  {
    id: 'dept-finanzas',
    nombre: 'Finanzas',
    descripcion: 'Contabilidad corporativa, tesorería y nómina',
    lider: 'José Pérez',
    baseCount: 16,
    seedRosterCount: 1,
    accentColor: 'rose',
  },
];

export const INITIAL_ROLES: RolePosition[] = [
  {
    id: 'role-1',
    nombre: 'Desarrollador Senior',
    departamento: 'Tecnología',
    salarioBase: 4200000,
    baseEmployeesCount: 12,
    seedRosterCount: 1,
  },
  {
    id: 'role-2',
    nombre: 'Analista RRHH',
    departamento: 'Talento Humano',
    salarioBase: 2600000,
    baseEmployeesCount: 5,
    seedRosterCount: 1,
  },
  {
    id: 'role-3',
    nombre: 'Ejecutivo Ventas',
    departamento: 'Ventas',
    salarioBase: 2400000,
    baseEmployeesCount: 22,
    seedRosterCount: 1,
  },
  {
    id: 'role-4',
    nombre: 'Contador',
    departamento: 'Finanzas',
    salarioBase: 3200000,
    baseEmployeesCount: 4,
    seedRosterCount: 1,
  },
  {
    id: 'role-5',
    nombre: 'Desarrollador Junior',
    departamento: 'Tecnología',
    salarioBase: 2500000,
    baseEmployeesCount: 8,
    seedRosterCount: 1,
  },
  {
    id: 'role-6',
    nombre: 'Diseñador UX',
    departamento: 'Tecnología',
    salarioBase: 3000000,
    baseEmployeesCount: 4,
    seedRosterCount: 1,
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { employeeId: 1, entrada: '08:02 AM', salida: '—', estado: 'Presente' },
  { employeeId: 2, entrada: '08:02 AM', salida: '—', estado: 'Presente' },
  { employeeId: 3, entrada: '08:02 AM', salida: '—', estado: 'Presente' },
  { employeeId: 4, entrada: '08:02 AM', salida: '—', estado: 'Presente' },
  { employeeId: 5, entrada: '08:02 AM', salida: '—', estado: 'Presente' },
  { employeeId: 6, entrada: '—', salida: '—', estado: 'Ausente' },
];

export const INITIAL_NOVEDADES: Novedad[] = [
  {
    id: 'nov-1',
    employeeId: 1,
    empleadoNombre: 'María González',
    tipo: 'Vacaciones',
    descripcion: 'Vacaciones 15 días - Diciembre',
    fecha: '2026-11-14',
    estado: 'Pendiente',
  },
  {
    id: 'nov-2',
    employeeId: 2,
    empleadoNombre: 'Carlos Rodríguez',
    tipo: 'Permiso',
    descripcion: 'Permiso médico 2 días',
    fecha: '2026-11-13',
    estado: 'Aprobada',
  },
  {
    id: 'nov-3',
    employeeId: 3,
    empleadoNombre: 'Ana Martínez',
    tipo: 'Bonificación',
    descripcion: 'Bonificación por cumplimiento metas',
    fecha: '2026-11-12',
    estado: 'Pendiente',
  },
  {
    id: 'nov-4',
    employeeId: 5,
    empleadoNombre: 'Laura López',
    tipo: 'Ascenso',
    descripcion: 'Evaluación para Desarrollador Semi-Senior',
    fecha: '2026-11-10',
    estado: 'Pendiente',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    actor: 'María González',
    accion: 'registró su entrada a las 08:02 AM',
    tiempo: 'Hace 5 min',
    tipo: 'nominal',
  },
  {
    id: 'act-2',
    actor: 'Carlos Rodríguez',
    accion: 'actualizó la ficha de personal en Talento Humano',
    tiempo: 'Hace 18 min',
    tipo: 'info',
  },
  {
    id: 'act-3',
    actor: 'Ana Martínez',
    accion: 'registró solicitud de bonificación por metas',
    tiempo: 'Hace 1 hora',
    tipo: 'warning',
  },
  {
    id: 'act-4',
    actor: 'José Pérez',
    accion: 'aprobó novedad de permiso médico',
    tiempo: 'Hace 2 horas',
    tipo: 'nominal',
  },
  {
    id: 'act-5',
    actor: 'Sistema HumanPro',
    accion: 'generó el reporte semanal de asistencia',
    tiempo: 'Ayer',
    tipo: 'info',
  },
];

export const INITIAL_SETTINGS: CompanySettings = {
  nombreEmpresa: 'HumanPro S.A.S',
  nit: '900.123.456-7',
  horarioEntrada: '08:00',
  horarioSalida: '18:00',
  correoAdmin: 'admin@humanpro.com',
  ciudad: 'Bogotá D.C., Colombia',
};

export const WEEKLY_ATTENDANCE_SERIES = [
  { day: 'Lun', present: 126 },
  { day: 'Mar', present: 128 },
  { day: 'Mié', present: 125 },
  { day: 'Jue', present: 127 },
  { day: 'Vie', present: 124 },
  { day: 'Sáb', present: 124 },
];

const STORAGE_KEY = 'humanpro_saas_state_v2';

export function getInitialState(): HrAppState {
  return {
    employees: INITIAL_EMPLOYEES,
    departments: INITIAL_DEPARTMENTS,
    roles: INITIAL_ROLES,
    attendance: INITIAL_ATTENDANCE,
    novedades: INITIAL_NOVEDADES,
    activities: INITIAL_ACTIVITIES,
    settings: INITIAL_SETTINGS,
  };
}

export function loadHrState(): HrAppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw) as Partial<HrAppState>;
    const defaults = getInitialState();
    return {
      employees: Array.isArray(parsed.employees) ? parsed.employees : defaults.employees,
      departments: Array.isArray(parsed.departments) ? parsed.departments : defaults.departments,
      roles: Array.isArray(parsed.roles) ? parsed.roles : defaults.roles,
      attendance: Array.isArray(parsed.attendance) ? parsed.attendance : defaults.attendance,
      novedades: Array.isArray(parsed.novedades) ? parsed.novedades : defaults.novedades,
      activities: Array.isArray(parsed.activities) ? parsed.activities : defaults.activities,
      settings: parsed.settings ? { ...defaults.settings, ...parsed.settings } : defaults.settings,
    };
  } catch {
    return getInitialState();
  }
}

export function saveHrState(state: HrAppState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors cleanly
  }
}
