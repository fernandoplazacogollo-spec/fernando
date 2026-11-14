import { useState, type FormEvent } from 'react';
import { Check, FilePlus2, FileText, X } from 'lucide-react';
import type {
  Employee,
  Novedad,
  NovedadStatus,
  NovedadType,
} from '../utils/hrLogic';

interface NovedadesViewProps {
  employees: Employee[];
  novedades: Novedad[];
  onCreateNovedad: (input: {
    employeeId: number;
    tipo: NovedadType;
    descripcion: string;
  }) => void;
  onUpdateNovedadStatus: (id: string, status: NovedadStatus) => void;
}

const NOVEDAD_TYPES: NovedadType[] = [
  'Vacaciones',
  'Permiso',
  'Incapacidad',
  'Bonificación',
  'Ascenso',
  'Llamado de atención',
];

const STATUS_BADGE: Record<NovedadStatus, string> = {
  Pendiente: 'bg-[#FEF3C7] text-[#92400E]',
  Aprobada: 'bg-[#DCFCE7] text-[#166534]',
  Rechazada: 'bg-[#FEE2E2] text-[#991B1B]',
};

export function NovedadesView({
  employees,
  novedades,
  onCreateNovedad,
  onUpdateNovedadStatus,
}: NovedadesViewProps) {
  const [employeeId, setEmployeeId] = useState<number>(employees[0]?.id ?? 1);
  const [tipo, setTipo] = useState<NovedadType>('Vacaciones');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState<string | null>(null);

  const pendingCount = novedades.filter((n) => n.estado === 'Pendiente').length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      setError('Describe brevemente el motivo de la novedad.');
      return;
    }
    onCreateNovedad({
      employeeId,
      tipo,
      descripcion: descripcion.trim(),
    });
    setDescripcion('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Novedades</h1>
          <p className="mt-1 text-sm text-slate-500">
            Solicitudes de vacaciones, permisos, incapacidades y movimientos de personal.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-amber-200 bg-[#FEF3C7] px-3.5 py-2 text-xs font-semibold text-[#92400E] font-tabular">
          <FileText className="h-4 w-4" />
          {pendingCount} pendientes por revisar
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Form Card */}
        <section className="hp-card p-6 xl:col-span-4 self-start">
          <h2 className="text-base font-semibold text-[#0F172A]">Registrar novedad</h2>
          <p className="mt-1 text-xs text-slate-500">
            Crea una nueva solicitud vinculada a un colaborador.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="nov-empleado"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Colaborador
              </label>
              <select
                id="nov-empleado"
                value={employeeId}
                onChange={(e) => setEmployeeId(Number(e.target.value))}
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombres} {emp.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="nov-tipo"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Tipo de novedad
              </label>
              <select
                id="nov-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as NovedadType)}
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm"
              >
                {NOVEDAD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="nov-descripcion"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Descripción *
              </label>
              <textarea
                id="nov-descripcion"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalle de fechas, soporte o justificación..."
                className="hp-input w-full rounded-xl px-3.5 py-2.5 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="hp-focus-ring w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors cursor-pointer"
            >
              <FilePlus2 className="h-4 w-4" />
              Registrar novedad
            </button>
          </form>
        </section>

        {/* Table Card */}
        <section className="hp-card overflow-hidden xl:col-span-8">
          <div className="px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Historial de novedades ({novedades.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Empleado</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Descripción</th>
                  <th className="py-3.5 px-4">Fecha</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-6 text-right">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm">
                {novedades.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#0F172A] whitespace-nowrap">
                      {item.empleadoNombre}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-[#EEF2FF] px-2.5 py-0.5 text-xs font-medium text-[#4F46E5]">
                        {item.tipo}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 min-w-[200px]">
                      {item.descripcion}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-tabular">
                      {item.fecha}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                          STATUS_BADGE[item.estado]
                        }`}
                      >
                        {item.estado}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      {item.estado === 'Pendiente' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onUpdateNovedadStatus(item.id, 'Aprobada')}
                            aria-label={`Aprobar novedad de ${item.empleadoNombre}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#DCFCE7] px-2.5 py-1.5 text-xs font-semibold text-[#166534] hover:bg-emerald-200/80 transition-colors cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Aprobar
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateNovedadStatus(item.id, 'Rechazada')}
                            aria-label={`Rechazar novedad de ${item.empleadoNombre}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#FEE2E2] px-2.5 py-1.5 text-xs font-semibold text-[#991B1B] hover:bg-red-200/80 transition-colors cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Gestionada</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
