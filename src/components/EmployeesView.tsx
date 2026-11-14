import { Eye, Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
import {
  filterEmployees,
  type Department,
  type Employee,
  type EmployeeStatus,
} from '../utils/hrLogic';
import { Avatar } from './Avatar';

interface EmployeesViewProps {
  employees: Employee[];
  departments: Department[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onOpenCreate: () => void;
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onRequestDeleteEmployee: (employee: Employee) => void;
}

const STATUS_BADGE: Record<EmployeeStatus, string> = {
  Activo: 'bg-[#DCFCE7] text-[#166534]',
  Inactivo: 'bg-[#FEE2E2] text-[#991B1B]',
};

export function EmployeesView({
  employees,
  departments,
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  onOpenCreate,
  onViewEmployee,
  onEditEmployee,
  onRequestDeleteEmployee,
}: EmployeesViewProps) {
  const filtered = filterEmployees(
    employees,
    searchQuery,
    selectedDepartment,
    selectedStatus
  );

  const hasFilters = Boolean(searchQuery.trim() || selectedDepartment || selectedStatus);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Empleados</h1>
          <p className="mt-1 text-sm text-slate-500">
            Directorio de colaboradores, cargos, contratos y estado laboral.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="hp-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4338CA] transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nuevo Empleado
        </button>
      </div>

      {/* Filters Card */}
      <div className="hp-card p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="relative md:col-span-6">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre o documento..."
              aria-label="Buscar empleado por nombre o documento"
              className="hp-input w-full rounded-xl py-2.5 pl-10 pr-3.5 text-sm"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              aria-label="Filtrar por departamento"
              className="hp-input w-full rounded-xl py-2.5 px-3.5 text-sm"
            >
              <option value="">Todos los departamentos</option>
              {departments.map((d) => (
                <option key={d.id} value={d.nombre}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filtrar por estado"
              className="hp-input w-full rounded-xl py-2.5 px-3.5 text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="hp-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#4F46E5]">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#0F172A]">
              No se encontraron empleados
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {hasFilters
                ? 'Prueba ajustando el texto de búsqueda o los filtros aplicados.'
                : 'Comienza registrando el primer colaborador de tu organización.'}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  onDepartmentChange('');
                  onStatusChange('');
                }}
                className="mt-4 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 cursor-pointer"
              >
                Limpiar filtros
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenCreate}
                className="mt-4 rounded-xl bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338CA] cursor-pointer"
              >
                + Nuevo Empleado
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Empleado</th>
                  <th className="py-3 px-3">Documento</th>
                  <th className="py-3 px-3">Cargo</th>
                  <th className="py-3 px-3">Departamento</th>
                  <th className="py-3 px-3">Ingreso</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm">
                {filtered.map((emp) => {
                  const fullName = `${emp.nombres} ${emp.apellidos}`;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5 min-w-[165px]">
                          <Avatar
                            src={emp.foto}
                            nombres={emp.nombres}
                            apellidos={emp.apellidos}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#0F172A] truncate">
                              {fullName}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{emp.correo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-xs text-slate-600 whitespace-nowrap font-tabular">
                        {emp.documento}
                      </td>
                      <td className="py-3 px-3 text-[#0F172A] font-medium whitespace-nowrap">
                        {emp.cargo}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {emp.departamento}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-tabular">
                        {emp.fechaIngreso}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                            STATUS_BADGE[emp.estado]
                          }`}
                        >
                          {emp.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onViewEmployee(emp)}
                            aria-label={`Ver detalle de ${fullName}`}
                            title="Ver detalle"
                            className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4F46E5] transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Ver</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onEditEmployee(emp)}
                            aria-label={`Editar a ${fullName}`}
                            title="Editar"
                            className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4F46E5] transition-colors cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onRequestDeleteEmployee(emp)}
                            aria-label={`Eliminar a ${fullName}`}
                            title="Eliminar"
                            className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
