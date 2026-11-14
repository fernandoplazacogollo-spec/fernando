import { useState, type FormEvent } from 'react';
import { Building2, Code2, Plus, TrendingUp, Users, Wallet } from 'lucide-react';
import {
  computeDepartmentStats,
  type Department,
  type Employee,
} from '../utils/hrLogic';

interface DepartmentsViewProps {
  departments: Department[];
  employees: Employee[];
  onCreateDepartment: (input: {
    nombre: string;
    descripcion: string;
    lider: string;
    accentColor: Department['accentColor'];
  }) => void;
}

const ACCENT_MAP: Record<
  Department['accentColor'],
  { iconBg: string; bar: string; badge: string }
> = {
  indigo: {
    iconBg: 'bg-[#EEF2FF] text-[#4F46E5]',
    bar: 'bg-[#4F46E5]',
    badge: 'bg-[#EEF2FF] text-[#4F46E5]',
  },
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-600',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-600',
    bar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700',
  },
  rose: {
    iconBg: 'bg-rose-50 text-rose-600',
    bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700',
  },
};

function getDeptIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('tecnolog')) return Code2;
  if (lower.includes('talento') || lower.includes('rrhh')) return Users;
  if (lower.includes('venta')) return TrendingUp;
  if (lower.includes('finanz')) return Wallet;
  return Building2;
}

export function DepartmentsView({
  departments,
  employees,
  onCreateDepartment,
}: DepartmentsViewProps) {
  const [nombre, setNombre] = useState('');
  const [lider, setLider] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [accentColor, setAccentColor] = useState<Department['accentColor']>('indigo');
  const [error, setError] = useState<string | null>(null);

  const stats = computeDepartmentStats(departments, employees);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre del departamento es obligatorio.');
      return;
    }
    if (
      departments.some(
        (d) => d.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
      )
    ) {
      setError('Ya existe un departamento con ese nombre.');
      return;
    }

    onCreateDepartment({
      nombre: nombre.trim(),
      lider: lider.trim() || 'Por asignar',
      descripcion: descripcion.trim() || 'Área operativa corporativa',
      accentColor,
    });

    setNombre('');
    setLider('');
    setDescripcion('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Departamentos
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Estructura organizacional, responsables de área y distribución de personal.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Department Cards Grid */}
        <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((dept) => {
            const theme = ACCENT_MAP[dept.accentColor] ?? ACCENT_MAP.indigo;
            const Icon = getDeptIcon(dept.nombre);
            return (
              <article key={dept.id} className="hp-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold font-tabular ${theme.badge}`}
                    >
                      {dept.count} empleados
                    </span>
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-[#0F172A]">{dept.nombre}</h2>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    {dept.descripcion}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500">
                      Líder: <strong className="text-[#0F172A]">{dept.lider}</strong>
                    </span>
                    <span className="font-semibold text-slate-700 font-tabular">
                      {dept.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${theme.bar}`}
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Create Department Form */}
        <section className="hp-card p-6 xl:col-span-4 self-start">
          <h2 className="text-base font-semibold text-[#0F172A]">Crear departamento</h2>
          <p className="mt-1 text-xs text-slate-500">
            Agrega una nueva área funcional a la compañía.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="dept-nombre"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Nombre del departamento *
              </label>
              <input
                id="dept-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Operaciones"
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="dept-lider"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Líder responsable
              </label>
              <input
                id="dept-lider"
                type="text"
                value={lider}
                onChange={(e) => setLider(e.target.value)}
                placeholder="Ej. Laura Gómez"
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="dept-desc"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Descripción
              </label>
              <textarea
                id="dept-desc"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Responsabilidades principales del área..."
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="dept-color"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Color identificador
              </label>
              <select
                id="dept-color"
                value={accentColor}
                onChange={(e) =>
                  setAccentColor(e.target.value as Department['accentColor'])
                }
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              >
                <option value="indigo">Indigo Corporativo</option>
                <option value="emerald">Esmeralda</option>
                <option value="amber">Ámbar</option>
                <option value="rose">Carmesí</option>
              </select>
            </div>

            <button
              type="submit"
              className="hp-focus-ring w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Crear departamento
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
