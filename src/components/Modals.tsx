import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  Briefcase,
  Building2,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import {
  formatCurrencyCOP,
  validateEmployeeForm,
  type AttendanceRecord,
  type ContractType,
  type Department,
  type Employee,
  type EmployeeFormInput,
  type EmployeeStatus,
  type RolePosition,
} from '../utils/hrLogic';
import { Avatar } from './Avatar';

interface EmployeeFormModalProps {
  open: boolean;
  editingEmployee: Employee | null;
  departments: Department[];
  roles: RolePosition[];
  onClose: () => void;
  onSave: (input: EmployeeFormInput, editingId: number | null) => void;
  onValidationError: (message: string) => void;
}

export function EmployeeFormModal({
  open,
  editingEmployee,
  departments,
  roles,
  onClose,
  onSave,
  onValidationError,
}: EmployeeFormModalProps) {
  const [form, setForm] = useState<EmployeeFormInput>({
    documento: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    cargo: roles[0]?.nombre ?? 'Desarrollador Senior',
    departamento: departments[0]?.nombre ?? 'Tecnología',
    fechaIngreso: '2026-11-14',
    tipoContrato: 'Indefinido',
    salario: roles[0]?.salarioBase ?? 3000000,
    estado: 'Activo',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    if (editingEmployee) {
      setForm({
        documento: editingEmployee.documento,
        nombres: editingEmployee.nombres,
        apellidos: editingEmployee.apellidos,
        correo: editingEmployee.correo,
        telefono: editingEmployee.telefono,
        cargo: editingEmployee.cargo,
        departamento: editingEmployee.departamento,
        fechaIngreso: editingEmployee.fechaIngreso,
        tipoContrato: editingEmployee.tipoContrato,
        salario: editingEmployee.salario,
        estado: editingEmployee.estado,
      });
    } else {
      setForm({
        documento: '',
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        cargo: roles[0]?.nombre ?? 'Desarrollador Senior',
        departamento: departments[0]?.nombre ?? 'Tecnología',
        fechaIngreso: '2026-11-14',
        tipoContrato: 'Indefinido',
        salario: roles[0]?.salarioBase ?? 3000000,
        estado: 'Activo',
      });
    }
    setErrors({});
  }, [open, editingEmployee, departments, roles]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateEmployeeForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      onValidationError('Por favor completa los campos obligatorios marcados con *.');
      return;
    }
    onSave(form, editingEmployee ? editingEmployee.id : null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-6 py-4">
          <div>
            <h2 id="employee-modal-title" className="text-lg font-bold text-[#0F172A]">
              {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Los campos marcados con * son obligatorios.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="emp-documento"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Documento *
              </label>
              <input
                id="emp-documento"
                type="text"
                value={form.documento}
                onChange={(e) => setForm({ ...form, documento: e.target.value })}
                placeholder="1098765499"
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm font-tabular"
              />
              {errors.documento && (
                <p className="mt-1 text-xs text-red-600">{errors.documento}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="emp-correo"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Correo corporativo *
              </label>
              <input
                id="emp-correo"
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                placeholder="nombre@humanpro.com"
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm"
              />
              {errors.correo && (
                <p className="mt-1 text-xs text-red-600">{errors.correo}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="emp-nombres"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Nombres *
              </label>
              <input
                id="emp-nombres"
                type="text"
                value={form.nombres}
                onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                placeholder="Sofía"
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm"
              />
              {errors.nombres && (
                <p className="mt-1 text-xs text-red-600">{errors.nombres}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="emp-apellidos"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Apellidos *
              </label>
              <input
                id="emp-apellidos"
                type="text"
                value={form.apellidos}
                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                placeholder="Mendoza"
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm"
              />
              {errors.apellidos && (
                <p className="mt-1 text-xs text-red-600">{errors.apellidos}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="emp-telefono"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Teléfono
              </label>
              <input
                id="emp-telefono"
                type="text"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="310 555 0199"
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="emp-ingreso"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Fecha de ingreso
              </label>
              <input
                id="emp-ingreso"
                type="date"
                value={form.fechaIngreso}
                onChange={(e) => setForm({ ...form, fechaIngreso: e.target.value })}
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm font-tabular"
              />
            </div>

            <div>
              <label
                htmlFor="emp-departamento"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Departamento
              </label>
              <select
                id="emp-departamento"
                value={form.departamento}
                onChange={(e) => setForm({ ...form, departamento: e.target.value })}
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.nombre}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="emp-cargo"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Cargo
              </label>
              <select
                id="emp-cargo"
                value={form.cargo}
                onChange={(e) => {
                  const selectedRole = roles.find((r) => r.nombre === e.target.value);
                  setForm({
                    ...form,
                    cargo: e.target.value,
                    salario:
                      !editingEmployee && selectedRole
                        ? selectedRole.salarioBase
                        : form.salario,
                  });
                }}
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.nombre}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="emp-contrato"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Tipo de contrato
              </label>
              <select
                id="emp-contrato"
                value={form.tipoContrato}
                onChange={(e) =>
                  setForm({ ...form, tipoContrato: e.target.value as ContractType })
                }
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm"
              >
                <option value="Indefinido">Indefinido</option>
                <option value="Fijo">Fijo</option>
                <option value="Prestación servicios">Prestación servicios</option>
                <option value="Aprendizaje">Aprendizaje</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="emp-salario"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Salario mensual (COP)
              </label>
              <input
                id="emp-salario"
                type="number"
                min={0}
                step={50000}
                value={form.salario}
                onChange={(e) => setForm({ ...form, salario: Number(e.target.value) })}
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm font-tabular"
              />
              {errors.salario && (
                <p className="mt-1 text-xs text-red-600">{errors.salario}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="emp-estado"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Estado laboral
              </label>
              <select
                id="emp-estado"
                value={form.estado}
                onChange={(e) =>
                  setForm({ ...form, estado: e.target.value as EmployeeStatus })
                }
                className="hp-input w-full rounded-xl px-3.5 py-2 text-sm"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="hp-focus-ring rounded-xl bg-[#4F46E5] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4338CA] transition-colors cursor-pointer"
            >
              {editingEmployee ? 'Guardar cambios' : 'Crear empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EmployeeDetailModalProps {
  employee: Employee | null;
  attendanceRecord?: AttendanceRecord;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

export function EmployeeDetailModal({
  employee,
  attendanceRecord,
  onClose,
  onEdit,
}: EmployeeDetailModalProps) {
  if (!employee) return null;

  const fullName = `${employee.nombres} ${employee.apellidos}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <h2 id="detail-modal-title" className="text-lg font-bold text-[#0F172A]">
            Ficha del Colaborador
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Header with photo */}
          <div className="flex items-center gap-4">
            <Avatar
              src={employee.foto}
              nombres={employee.nombres}
              apellidos={employee.apellidos}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-[#0F172A]">{fullName}</h3>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                    employee.estado === 'Activo'
                      ? 'bg-[#DCFCE7] text-[#166534]'
                      : 'bg-[#FEE2E2] text-[#991B1B]'
                  }`}
                >
                  {employee.estado}
                </span>
              </div>
              <p className="text-sm font-medium text-[#4F46E5] mt-0.5">{employee.cargo}</p>
              <p className="text-xs text-slate-500">{employee.departamento}</p>
            </div>
          </div>

          {/* Grid Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm">
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-500">Documento</p>
                <p className="font-semibold text-[#0F172A] font-tabular">
                  {employee.documento}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500">Correo</p>
                <p className="font-medium text-[#0F172A] truncate">{employee.correo}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-500">Teléfono</p>
                <p className="font-medium text-[#0F172A]">
                  {employee.telefono || 'No registrado'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-500">Fecha de ingreso</p>
                <p className="font-medium text-[#0F172A] font-tabular">
                  {employee.fechaIngreso}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-500">Tipo de contrato</p>
                <p className="font-medium text-[#0F172A]">{employee.tipoContrato}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] text-slate-500">Salario mensual</p>
                <p className="font-bold text-[#0F172A] font-tabular">
                  {formatCurrencyCOP(employee.salario)}
                </p>
              </div>
            </div>
          </div>

          {/* Asistencia reciente */}
          <div className="rounded-xl border border-[#E2E8F0] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                <UserCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-[#0F172A]">Asistencia reciente</p>
                <p className="text-xs text-slate-500">
                  Entrada: {attendanceRecord?.entrada ?? '08:02 AM'} · Salida:{' '}
                  {attendanceRecord?.salida ?? '—'}
                </p>
              </div>
            </div>
            <span className="rounded-md bg-[#DCFCE7] px-2.5 py-1 text-xs font-semibold text-[#166534]">
              {attendanceRecord?.estado ?? 'Presente'}
            </span>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-3.5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(employee);
            }}
            className="rounded-xl bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338CA] cursor-pointer"
          >
            Editar empleado
          </button>
        </div>
      </div>
    </div>
  );
}

interface ConfirmDeleteModalProps {
  employee: Employee | null;
  onCancel: () => void;
  onConfirm: (employee: Employee) => void;
}

export function ConfirmDeleteModal({
  employee,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!employee) return null;

  const fullName = `${employee.nombres} ${employee.apellidos}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h2 id="delete-modal-title" className="text-base font-bold text-[#0F172A]">
              Confirmar eliminación
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              ¿Estás seguro de eliminar a{' '}
              <strong className="text-[#0F172A]">{fullName}</strong> del directorio de
              empleados? Esta acción actualizará los indicadores de inmediato.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(employee)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
