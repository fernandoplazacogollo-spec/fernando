export type PageId =
  | 'dashboard'
  | 'empleados'
  | 'departamentos'
  | 'cargos'
  | 'asistencia'
  | 'novedades'
  | 'reportes'
  | 'freefire'
  | 'configuracion';

export type EmployeeStatus = 'Activo' | 'Inactivo';
export type ContractType = 'Indefinido' | 'Fijo' | 'Prestación servicios' | 'Aprendizaje';
export type AttendanceStatus = 'Presente' | 'Retardo' | 'Ausente' | 'Permiso';
export type NovedadType =
  | 'Vacaciones'
  | 'Incapacidad'
  | 'Permiso'
  | 'Llamado de atención'
  | 'Bonificación'
  | 'Ascenso';
export type NovedadStatus = 'Pendiente' | 'Aprobada' | 'Rechazada';

export interface Employee {
  id: number;
  documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  cargo: string;
  departamento: string;
  fechaIngreso: string;
  tipoContrato: ContractType;
  salario: number;
  estado: EmployeeStatus;
  foto?: string;
}

export interface EmployeeFormInput {
  documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  cargo: string;
  departamento: string;
  fechaIngreso: string;
  tipoContrato: ContractType;
  salario: number;
  estado: EmployeeStatus;
}

export interface Department {
  id: string;
  nombre: string;
  descripcion: string;
  lider: string;
  baseCount: number;
  seedRosterCount: number;
  accentColor: 'indigo' | 'emerald' | 'amber' | 'rose';
}

export interface RolePosition {
  id: string;
  nombre: string;
  departamento: string;
  salarioBase: number;
  baseEmployeesCount: number;
  seedRosterCount: number;
}

export interface AttendanceRecord {
  employeeId: number;
  entrada: string;
  salida: string;
  estado: AttendanceStatus;
}

export interface Novedad {
  id: string;
  employeeId: number;
  empleadoNombre: string;
  tipo: NovedadType;
  descripcion: string;
  fecha: string;
  estado: NovedadStatus;
}

export interface ActivityItem {
  id: string;
  actor: string;
  accion: string;
  tiempo: string;
  tipo: 'nominal' | 'info' | 'warning' | 'alert';
}

export interface CompanySettings {
  nombreEmpresa: string;
  nit: string;
  horarioEntrada: string;
  horarioSalida: string;
  correoAdmin: string;
  ciudad: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const CORPORATE_BASE_ACTIVE = 128;
export const CORPORATE_SEED_ACTIVE = 5;
export const CORPORATE_BASE_PRESENT = 124;
export const CORPORATE_BASE_LATE = 2;
export const CORPORATE_BASE_ABSENT = 2;
export const CORPORATE_SEED_PRESENT = 5;
export const CORPORATE_SEED_LATE = 0;
export const CORPORATE_SEED_ABSENT = 0;

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function validateLogin(
  email: string,
  password: string
): { ok: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { ok: false, error: 'Ingresa tu correo electrónico.' };
  }
  if (!password.trim()) {
    return { ok: false, error: 'Ingresa tu contraseña.' };
  }
  if (cleanEmail === 'admin@humanpro.com' && password === '123456') {
    return { ok: true };
  }
  return { ok: false, error: 'Correo o contraseña incorrectos. Demo: admin@humanpro.com / 123456' };
}

export function validateEmployeeForm(input: EmployeeFormInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.documento.trim()) {
    errors.documento = 'El documento es obligatorio.';
  } else if (input.documento.trim().length < 5) {
    errors.documento = 'El documento debe tener al menos 5 caracteres.';
  }

  if (!input.correo.trim()) {
    errors.correo = 'El correo es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.correo.trim())) {
    errors.correo = 'Ingresa un correo electrónico válido.';
  }

  if (!input.nombres.trim()) {
    errors.nombres = 'Los nombres son obligatorios.';
  }

  if (!input.apellidos.trim()) {
    errors.apellidos = 'Los apellidos son obligatorios.';
  }

  if (Number.isNaN(input.salario) || input.salario < 0) {
    errors.salario = 'El salario debe ser un monto válido mayor o igual a 0.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterEmployees(
  employees: Employee[],
  query: string,
  department: string,
  status: string
): Employee[] {
  const q = normalizeText(query);
  return employees.filter((emp) => {
    const matchesQuery =
      !q ||
      normalizeText(`${emp.nombres} ${emp.apellidos}`).includes(q) ||
      normalizeText(emp.documento).includes(q) ||
      normalizeText(emp.correo).includes(q) ||
      normalizeText(emp.cargo).includes(q) ||
      normalizeText(emp.departamento).includes(q);

    const matchesDepartment = !department || emp.departamento === department;
    const matchesStatus = !status || emp.estado === status;

    return matchesQuery && matchesDepartment && matchesStatus;
  });
}

export function upsertEmployee(
  employees: Employee[],
  input: EmployeeFormInput,
  editingId: number | null,
  fallbackPhoto?: string
): { employees: Employee[]; saved: Employee; isEdit: boolean } {
  if (editingId !== null) {
    let updatedEmployee: Employee | null = null;
    const nextList = employees.map((emp) => {
      if (emp.id !== editingId) return emp;
      updatedEmployee = {
        ...emp,
        documento: input.documento.trim(),
        nombres: input.nombres.trim(),
        apellidos: input.apellidos.trim(),
        correo: input.correo.trim(),
        telefono: input.telefono.trim(),
        cargo: input.cargo,
        departamento: input.departamento,
        fechaIngreso: input.fechaIngreso,
        tipoContrato: input.tipoContrato,
        salario: Number(input.salario) || 0,
        estado: input.estado,
      };
      return updatedEmployee;
    });

    if (updatedEmployee) {
      return { employees: nextList, saved: updatedEmployee, isEdit: true };
    }
  }

  const nextId = employees.reduce((max, emp) => Math.max(max, emp.id), 0) + 1;
  const created: Employee = {
    id: nextId,
    documento: input.documento.trim(),
    nombres: input.nombres.trim(),
    apellidos: input.apellidos.trim(),
    correo: input.correo.trim(),
    telefono: input.telefono.trim(),
    cargo: input.cargo,
    departamento: input.departamento,
    fechaIngreso: input.fechaIngreso,
    tipoContrato: input.tipoContrato,
    salario: Number(input.salario) || 0,
    estado: input.estado,
    foto: fallbackPhoto,
  };

  return {
    employees: [created, ...employees],
    saved: created,
    isEdit: false,
  };
}

export function computeAttendanceSummary(
  records: AttendanceRecord[],
  useCorporateBaseline = true
) {
  const rawPresentes = records.filter((r) => r.estado === 'Presente').length;
  const rawRetardos = records.filter((r) => r.estado === 'Retardo').length;
  const rawAusentes = records.filter((r) => r.estado === 'Ausente').length;
  const permisos = records.filter((r) => r.estado === 'Permiso').length;

  if (!useCorporateBaseline) {
    const total = records.length;
    const attendanceRate = total > 0 ? Math.round(((rawPresentes + rawRetardos) / total) * 100) : 0;
    return {
      presentes: rawPresentes,
      retardos: rawRetardos,
      ausentes: rawAusentes,
      permisos,
      total,
      attendanceRate,
    };
  }

  const presentes = Math.max(0, CORPORATE_BASE_PRESENT + (rawPresentes - CORPORATE_SEED_PRESENT));
  const retardos = Math.max(0, CORPORATE_BASE_LATE + (rawRetardos - CORPORATE_SEED_LATE));
  const ausentes = Math.max(0, CORPORATE_BASE_ABSENT + (rawAusentes - CORPORATE_SEED_ABSENT));
  const total = presentes + retardos + ausentes + permisos;
  const attendanceRate = total > 0 ? Math.round(((presentes + retardos) / total) * 100) : 0;

  return { presentes, retardos, ausentes, permisos, total, attendanceRate };
}

export function computeDepartmentStats(
  departments: Department[],
  employees: Employee[]
) {
  const withCounts = departments.map((dept) => {
    const currentRoster = employees.filter((e) => e.departamento === dept.nombre).length;
    const count = Math.max(0, dept.baseCount + (currentRoster - dept.seedRosterCount));
    return { ...dept, count };
  });

  const maxDeptCount = Math.max(...withCounts.map((d) => d.count), 1);

  return withCounts.map((dept) => ({
    ...dept,
    percentage: Math.min(100, Math.round((dept.count / maxDeptCount) * 100)),
  }));
}

export function computeRoleHeadcount(
  role: RolePosition,
  employees: Employee[]
): number {
  const currentRoster = employees.filter((e) => e.cargo === role.nombre).length;
  return Math.max(0, role.baseEmployeesCount + (currentRoster - role.seedRosterCount));
}

export function computeDashboardMetrics(
  employees: Employee[],
  departments: Department[],
  attendance: AttendanceRecord[],
  novedades: Novedad[]
) {
  const activeRoster = employees.filter((e) => e.estado === 'Activo');
  const activeCount = Math.max(
    0,
    CORPORATE_BASE_ACTIVE + (activeRoster.length - CORPORATE_SEED_ACTIVE)
  );
  const inactiveCount = employees.length - activeRoster.length;

  const activeIds = new Set(activeRoster.map((e) => e.id));
  const activeAttendance = attendance.filter((a) => activeIds.has(a.employeeId));
  const attendanceSummary = computeAttendanceSummary(activeAttendance, true);

  const pendingNovedades = novedades.filter((n) => n.estado === 'Pendiente').length;
  const totalPayroll = activeRoster.reduce((sum, emp) => sum + emp.salario, 0);
  const departmentStats = computeDepartmentStats(departments, employees);
  const largestDepartment =
    [...departmentStats].sort((a, b) => b.count - a.count)[0]?.nombre ?? 'Sin datos';

  return {
    totalEmployees: employees.length,
    activeCount,
    inactiveCount,
    presentCount: attendanceSummary.presentes,
    lateCount: attendanceSummary.retardos,
    absentCount: attendanceSummary.ausentes,
    permissionCount: attendanceSummary.permisos,
    attendanceRate: attendanceSummary.attendanceRate,
    departmentCount: departments.length,
    largestDepartment,
    pendingNovedades,
    totalPayroll,
    departmentStats,
  };
}

export function updateNovedadStatus(
  novedades: Novedad[],
  id: string,
  nextStatus: NovedadStatus
): Novedad[] {
  return novedades.map((item) =>
    item.id === id ? { ...item, estado: nextStatus } : item
  );
}

export function formatCurrencyCOP(amount: number): string {
  return `$${Math.round(amount).toLocaleString('es-CO')}`;
}

export function getInitials(nombres: string, apellidos: string): string {
  const first = nombres.trim().charAt(0).toUpperCase();
  const last = apellidos.trim().charAt(0).toUpperCase();
  return `${first}${last}` || 'HP';
}

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCsvReport(
  type: 'empleados' | 'asistencia' | 'nomina',
  employees: Employee[],
  attendance: AttendanceRecord[]
): { filename: string; content: string; rowCount: number } {
  const bom = '\uFEFF';
  if (type === 'empleados') {
    const header = [
      'Documento',
      'Nombres',
      'Apellidos',
      'Correo',
      'Cargo',
      'Departamento',
      'Contrato',
      'Ingreso',
      'Estado',
    ];
    const rows = employees.map((e) => [
      e.documento,
      e.nombres,
      e.apellidos,
      e.correo,
      e.cargo,
      e.departamento,
      e.tipoContrato,
      e.fechaIngreso,
      e.estado,
    ]);
    return {
      filename: 'humanpro_empleados_2026.csv',
      content: bom + [header, ...rows].map((r) => r.map(escapeCsvCell).join(',')).join('\n'),
      rowCount: rows.length,
    };
  }

  if (type === 'asistencia') {
    const byId = new Map(attendance.map((a) => [a.employeeId, a]));
    const header = ['Documento', 'Empleado', 'Departamento', 'Entrada', 'Salida', 'Estado'];
    const rows = employees.map((e) => {
      const rec = byId.get(e.id);
      return [
        e.documento,
        `${e.nombres} ${e.apellidos}`,
        e.departamento,
        rec?.entrada || '—',
        rec?.salida || '—',
        rec?.estado || 'Sin registro',
      ];
    });
    return {
      filename: 'humanpro_asistencia_2026.csv',
      content: bom + [header, ...rows].map((r) => r.map(escapeCsvCell).join(',')).join('\n'),
      rowCount: rows.length,
    };
  }

  const header = ['Documento', 'Empleado', 'Cargo', 'Departamento', 'Estado', 'Salario Base'];
  const rows = employees.map((e) => [
    e.documento,
    `${e.nombres} ${e.apellidos}`,
    e.cargo,
    e.departamento,
    e.estado,
    e.salario,
  ]);
  return {
    filename: 'humanpro_nomina_2026.csv',
    content: bom + [header, ...rows].map((r) => r.map(escapeCsvCell).join(',')).join('\n'),
    rowCount: rows.length,
  };
}
