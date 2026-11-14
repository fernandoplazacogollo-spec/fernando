import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeAttendanceSummary,
  computeDashboardMetrics,
  computeRoleHeadcount,
  filterEmployees,
  generateCsvReport,
  updateNovedadStatus,
  upsertEmployee,
  validateEmployeeForm,
  validateLogin,
  type AttendanceRecord,
  type Department,
  type Employee,
  type Novedad,
  type RolePosition,
} from './hrLogic';

const sampleEmployees: Employee[] = [
  {
    id: 1,
    documento: '1098765432',
    nombres: 'María',
    apellidos: 'González',
    correo: 'maria@humanpro.com',
    telefono: '3001112233',
    cargo: 'Desarrollador Senior',
    departamento: 'Tecnología',
    fechaIngreso: '2023-02-15',
    tipoContrato: 'Indefinido',
    salario: 4200000,
    estado: 'Activo',
  },
  {
    id: 2,
    documento: '1098765433',
    nombres: 'Carlos',
    apellidos: 'Rodríguez',
    correo: 'carlos@humanpro.com',
    telefono: '3002223344',
    cargo: 'Analista RRHH',
    departamento: 'Talento Humano',
    fechaIngreso: '2024-01-10',
    tipoContrato: 'Indefinido',
    salario: 2600000,
    estado: 'Activo',
  },
  {
    id: 3,
    documento: '1098765434',
    nombres: 'Ana',
    apellidos: 'Martínez',
    correo: 'ana@humanpro.com',
    telefono: '3003334455',
    cargo: 'Ejecutivo Ventas',
    departamento: 'Ventas',
    fechaIngreso: '2024-05-20',
    tipoContrato: 'Indefinido',
    salario: 2400000,
    estado: 'Activo',
  },
  {
    id: 4,
    documento: '1098765435',
    nombres: 'José',
    apellidos: 'Pérez',
    correo: 'jose@humanpro.com',
    telefono: '3004445566',
    cargo: 'Contador',
    departamento: 'Finanzas',
    fechaIngreso: '2022-09-01',
    tipoContrato: 'Indefinido',
    salario: 3200000,
    estado: 'Activo',
  },
  {
    id: 5,
    documento: '1098765436',
    nombres: 'Laura',
    apellidos: 'López',
    correo: 'laura@humanpro.com',
    telefono: '3005556677',
    cargo: 'Desarrollador Junior',
    departamento: 'Tecnología',
    fechaIngreso: '2025-03-01',
    tipoContrato: 'Indefinido',
    salario: 2500000,
    estado: 'Activo',
  },
  {
    id: 6,
    documento: '1098765437',
    nombres: 'Diego',
    apellidos: 'Torres',
    correo: 'diego@humanpro.com',
    telefono: '3006667788',
    cargo: 'Diseñador UX',
    departamento: 'Tecnología',
    fechaIngreso: '2024-08-12',
    tipoContrato: 'Fijo',
    salario: 3000000,
    estado: 'Inactivo',
  },
];

const sampleDepartments: Department[] = [
  {
    id: 'dep-1',
    nombre: 'Tecnología',
    descripcion: 'Desarrollo',
    lider: 'María',
    baseCount: 42,
    seedRosterCount: 3,
    accentColor: 'indigo',
  },
  {
    id: 'dep-2',
    nombre: 'Talento Humano',
    descripcion: 'Personas',
    lider: 'Carlos',
    baseCount: 12,
    seedRosterCount: 1,
    accentColor: 'emerald',
  },
];

const sampleAttendance: AttendanceRecord[] = [
  { employeeId: 1, entrada: '08:02 AM', salida: '—', estado: 'Presente' },
  { employeeId: 2, entrada: '08:02 AM', salida: '—', estado: 'Presente' },
  { employeeId: 3, entrada: '08:02 AM', salida: '—', estado: 'Presente' },
  { employeeId: 4, entrada: '08:02 AM', salida: '—', estado: 'Presente' },
  { employeeId: 5, entrada: '08:02 AM', salida: '—', estado: 'Presente' },
];

const sampleNovedades: Novedad[] = [
  {
    id: 'nov-1',
    employeeId: 1,
    empleadoNombre: 'María González',
    tipo: 'Vacaciones',
    descripcion: '15 días en diciembre',
    fecha: '2026-11-14',
    estado: 'Pendiente',
  },
];

test('validateLogin enforces demo credentials', () => {
  assert.equal(validateLogin('admin@humanpro.com', '123456').ok, true);
  assert.equal(validateLogin('', '123456').ok, false);
  assert.equal(validateLogin('other@humanpro.com', '123456').ok, false);
});

test('validateEmployeeForm rejects missing required fields and invalid email', () => {
  const emptyRes = validateEmployeeForm({
    documento: '',
    nombres: '',
    apellidos: '',
    correo: 'bad-email',
    telefono: '',
    cargo: 'Contador',
    departamento: 'Finanzas',
    fechaIngreso: '2026-11-14',
    tipoContrato: 'Indefinido',
    salario: 2500000,
    estado: 'Activo',
  });
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.errors.documento);
  assert.ok(emptyRes.errors.correo);
  assert.ok(emptyRes.errors.nombres);
  assert.ok(emptyRes.errors.apellidos);

  const validRes = validateEmployeeForm({
    documento: '1098765999',
    nombres: 'Lucía',
    apellidos: 'Vargas',
    correo: 'lucia@humanpro.com',
    telefono: '3110000000',
    cargo: 'Contador',
    departamento: 'Finanzas',
    fechaIngreso: '2026-11-14',
    tipoContrato: 'Indefinido',
    salario: 3200000,
    estado: 'Activo',
  });
  assert.equal(validRes.valid, true);
  assert.deepEqual(validRes.errors, {});
});

test('filterEmployees matches accent-insensitive query, department, and status', () => {
  assert.equal(filterEmployees(sampleEmployees, 'maria', '', '').length, 1);
  assert.equal(filterEmployees(sampleEmployees, '', 'Talento Humano', '').length, 1);
  assert.equal(filterEmployees(sampleEmployees, '', '', 'Activo').length, 5);
  assert.equal(filterEmployees(sampleEmployees, 'no-match', '', '').length, 0);
});

test('upsertEmployee creates and updates without duplicating', () => {
  const created = upsertEmployee(
    sampleEmployees,
    {
      documento: '1098765499',
      nombres: 'Sofía',
      apellidos: 'Mendoza',
      correo: 'sofia@humanpro.com',
      telefono: '3105556677',
      cargo: 'Desarrollador Senior',
      departamento: 'Tecnología',
      fechaIngreso: '2026-11-14',
      tipoContrato: 'Indefinido',
      salario: 3000000,
      estado: 'Activo',
    },
    null
  );
  assert.equal(created.isEdit, false);
  assert.equal(created.employees.length, 7);
  assert.equal(created.employees[0].nombres, 'Sofía');

  const updated = upsertEmployee(
    created.employees,
    {
      documento: '1098765432',
      nombres: 'María Elena',
      apellidos: 'González',
      correo: 'maria@humanpro.com',
      telefono: '3001112233',
      cargo: 'Desarrollador Senior',
      departamento: 'Tecnología',
      fechaIngreso: '2023-02-15',
      tipoContrato: 'Indefinido',
      salario: 5100000,
      estado: 'Activo',
    },
    1
  );
  assert.equal(updated.isEdit, true);
  assert.equal(updated.employees.length, 7);
  assert.equal(updated.employees.find((e) => e.id === 1)?.nombres, 'María Elena');
  assert.equal(updated.employees.find((e) => e.id === 1)?.salario, 5100000);
});

test('computeDashboardMetrics calculates corporate baseline 128/124/98% and reacts to additions', () => {
  const metrics = computeDashboardMetrics(
    sampleEmployees,
    sampleDepartments,
    sampleAttendance,
    sampleNovedades
  );
  assert.equal(metrics.activeCount, 128);
  assert.equal(metrics.presentCount, 124);
  assert.equal(metrics.lateCount, 2);
  assert.equal(metrics.absentCount, 2);
  assert.equal(metrics.attendanceRate, 98);
  assert.equal(metrics.pendingNovedades, 1);
  assert.equal(metrics.departmentStats[0].count, 42);

  // Adding a new active employee increments activeCount to 129 and department count to 43
  const withNew = upsertEmployee(
    sampleEmployees,
    {
      documento: '1099000111',
      nombres: 'Elena',
      apellidos: 'Ruiz',
      correo: 'elena@humanpro.com',
      telefono: '3009998877',
      cargo: 'Desarrollador Senior',
      departamento: 'Tecnología',
      fechaIngreso: '2026-11-14',
      tipoContrato: 'Indefinido',
      salario: 4000000,
      estado: 'Activo',
    },
    null
  );
  const nextMetrics = computeDashboardMetrics(
    withNew.employees,
    sampleDepartments,
    sampleAttendance,
    sampleNovedades
  );
  assert.equal(nextMetrics.activeCount, 129);
  assert.equal(nextMetrics.departmentStats[0].count, 43);

  const attSummary = computeAttendanceSummary([
    { employeeId: 1, entrada: '08:00', salida: '—', estado: 'Presente' },
    { employeeId: 2, entrada: '08:25', salida: '—', estado: 'Retardo' },
    { employeeId: 3, entrada: '—', salida: '—', estado: 'Ausente' },
  ], false);
  assert.equal(attSummary.presentes, 1);
  assert.equal(attSummary.retardos, 1);
  assert.equal(attSummary.ausentes, 1);
  assert.equal(attSummary.attendanceRate, 67);
});

test('computeRoleHeadcount and updateNovedadStatus work accurately', () => {
  const role: RolePosition = {
    id: 'r1',
    nombre: 'Desarrollador Senior',
    departamento: 'Tecnología',
    salarioBase: 4200000,
    baseEmployeesCount: 12,
    seedRosterCount: 1,
  };
  assert.equal(computeRoleHeadcount(role, sampleEmployees), 12);

  const approved = updateNovedadStatus(sampleNovedades, 'nov-1', 'Aprobada');
  assert.equal(approved[0].estado, 'Aprobada');

  const csv = generateCsvReport('nomina', sampleEmployees, sampleAttendance);
  assert.equal(csv.rowCount, 6);
  assert.ok(csv.content.includes('María González'));
});
