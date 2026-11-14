import { useState, type FormEvent } from 'react';
import { Briefcase, Check, Pencil, Plus, X } from 'lucide-react';
import {
  computeRoleHeadcount,
  formatCurrencyCOP,
  type Department,
  type Employee,
  type RolePosition,
} from '../utils/hrLogic';

interface CargosViewProps {
  roles: RolePosition[];
  departments: Department[];
  employees: Employee[];
  onCreateRole: (input: {
    nombre: string;
    departamento: string;
    salarioBase: number;
  }) => void;
  onUpdateRole: (
    id: string,
    input: { nombre: string; departamento: string; salarioBase: number }
  ) => void;
}

export function CargosView({
  roles,
  departments,
  employees,
  onCreateRole,
  onUpdateRole,
}: CargosViewProps) {
  const [nombre, setNombre] = useState('');
  const [departamento, setDepartamento] = useState(
    departments[0]?.nombre ?? 'Tecnología'
  );
  const [salarioBase, setSalarioBase] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editSalario, setEditSalario] = useState('');

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    const numericSalary = Number(salarioBase);
    if (!nombre.trim()) {
      setFormError('El nombre del cargo es obligatorio.');
      return;
    }
    if (Number.isNaN(numericSalary) || numericSalary <= 0) {
      setFormError('Ingresa un salario base válido.');
      return;
    }

    onCreateRole({
      nombre: nombre.trim(),
      departamento,
      salarioBase: numericSalary,
    });
    setNombre('');
    setSalarioBase('');
    setFormError(null);
  };

  const startEdit = (role: RolePosition) => {
    setEditingId(role.id);
    setEditNombre(role.nombre);
    setEditDept(role.departamento);
    setEditSalario(String(role.salarioBase));
  };

  const saveEdit = (id: string) => {
    const parsedSalary = Number(editSalario);
    if (!editNombre.trim() || Number.isNaN(parsedSalary) || parsedSalary <= 0) {
      return;
    }
    onUpdateRole(id, {
      nombre: editNombre.trim(),
      departamento: editDept,
      salarioBase: parsedSalary,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Cargos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Catálogo de posiciones corporativas, departamento asignado y salario base.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Table */}
        <section className="hp-card overflow-hidden xl:col-span-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                <Briefcase className="h-4 w-4" />
              </span>
              <h2 className="text-base font-semibold text-[#0F172A]">
                Estructura de cargos ({roles.length})
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Cargo</th>
                  <th className="py-3.5 px-4">Departamento</th>
                  <th className="py-3.5 px-4">Salario Base</th>
                  <th className="py-3.5 px-4 text-center">Empleados</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm">
                {roles.map((role) => {
                  const isEditing = editingId === role.id;
                  const count = computeRoleHeadcount(role, employees);

                  return (
                    <tr key={role.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-[#0F172A] whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editNombre}
                            onChange={(e) => setEditNombre(e.target.value)}
                            aria-label="Editar nombre del cargo"
                            className="hp-input w-44 rounded-lg px-2.5 py-1.5 text-sm"
                          />
                        ) : (
                          role.nombre
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editDept}
                            onChange={(e) => setEditDept(e.target.value)}
                            aria-label="Editar departamento del cargo"
                            className="hp-input rounded-lg px-2.5 py-1.5 text-sm"
                          >
                            {departments.map((d) => (
                              <option key={d.id} value={d.nombre}>
                                {d.nombre}
                              </option>
                            ))}
                          </select>
                        ) : (
                          role.departamento
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#0F172A] whitespace-nowrap font-tabular">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editSalario}
                            onChange={(e) => setEditSalario(e.target.value)}
                            aria-label="Editar salario base"
                            className="hp-input w-32 rounded-lg px-2.5 py-1.5 text-sm font-tabular"
                          />
                        ) : (
                          formatCurrencyCOP(role.salarioBase)
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center rounded-md bg-[#EEF2FF] px-2.5 py-0.5 text-xs font-semibold text-[#4F46E5] font-tabular">
                          {count}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => saveEdit(role.id)}
                              aria-label={`Guardar cambios de ${role.nombre}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#4F46E5] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#4338CA] cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              aria-label="Cancelar edición"
                              className="inline-flex items-center rounded-lg border border-[#E2E8F0] bg-white p-1.5 text-slate-500 hover:bg-slate-50 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(role)}
                            aria-label={`Editar cargo ${role.nombre}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4F46E5] transition-colors cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* New Role Form */}
        <section className="hp-card p-6 xl:col-span-4 self-start">
          <h2 className="text-base font-semibold text-[#0F172A]">Nuevo cargo</h2>
          <p className="mt-1 text-xs text-slate-500">
            Define una nueva posición y su compensación base mensual.
          </p>

          {formError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreate} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="cargo-nombre"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Nombre del cargo *
              </label>
              <input
                id="cargo-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Líder de Producto"
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="cargo-departamento"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Departamento
              </label>
              <select
                id="cargo-departamento"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
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
                htmlFor="cargo-salario"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Salario base mensual (COP) *
              </label>
              <input
                id="cargo-salario"
                type="number"
                min={0}
                step={50000}
                value={salarioBase}
                onChange={(e) => setSalarioBase(e.target.value)}
                placeholder="3500000"
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm font-tabular"
              />
            </div>

            <button
              type="submit"
              className="hp-focus-ring w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Crear cargo
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
