import { CalendarCheck2, Download, FileSpreadsheet, Users, Wallet } from 'lucide-react';
import { WEEKLY_ATTENDANCE_SERIES } from '../data/seed';
import type { AttendanceRecord, Employee, Novedad } from '../utils/hrLogic';
import { NovedadesDoughnutChart, WeeklyAttendanceLineChart } from './Charts';

interface ReportsViewProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  novedades: Novedad[];
  onExportReport: (type: 'empleados' | 'asistencia' | 'nomina') => void;
}

const SLICE_COLORS: Record<string, string> = {
  Vacaciones: '#4F46E5',
  Permiso: '#10B981',
  Incapacidad: '#F59E0B',
  Bonificación: '#06B6D4',
  Ascenso: '#8B5CF6',
  'Llamado de atención': '#EF4444',
};

export function ReportsView({
  novedades,
  onExportReport,
}: ReportsViewProps) {
  const countsByType = new Map<string, number>();
  for (const nov of novedades) {
    countsByType.set(nov.tipo, (countsByType.get(nov.tipo) ?? 0) + 1);
  }

  const doughnutSlices = Array.from(countsByType.entries()).map(([label, value]) => ({
    label,
    value,
    color: SLICE_COLORS[label] ?? '#64748B',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Reportes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Analítica semanal de asistencia, distribución de novedades y exportación ejecutiva.
        </p>
      </div>

      {/* 2 Chart.js Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="hp-card p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Asistencia Semanal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Colaboradores presentes de lunes a sábado
            </p>
          </div>
          <WeeklyAttendanceLineChart series={WEEKLY_ATTENDANCE_SERIES} />
        </section>

        <section className="hp-card p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Distribución de Novedades
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clasificación por tipo de solicitud registrada ({novedades.length} total)
            </p>
          </div>
          <NovedadesDoughnutChart slices={doughnutSlices} />
        </section>
      </div>

      {/* 3 Export Cards */}
      <section aria-label="Exportación de reportes">
        <div className="mb-3 flex items-center gap-2">
          <FileSpreadsheet className="h-4.5 w-4.5 text-[#4F46E5]" />
          <h2 className="text-base font-semibold text-[#0F172A]">
            Centro de Exportación
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="hp-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#0F172A]">
                Reporte de Empleados
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Directorio completo con documento, cargo, departamento, contrato y estado.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onExportReport('empleados')}
              className="hp-focus-ring mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-[#EEF2FF] hover:text-[#4F46E5] hover:border-[#C7D2FE] transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Generar Reporte
            </button>
          </div>

          <div className="hp-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarCheck2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#0F172A]">
                Reporte de Asistencia
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Consolidado de entradas, salidas, retardos y ausencias de la jornada.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onExportReport('asistencia')}
              className="hp-focus-ring mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-[#EEF2FF] hover:text-[#4F46E5] hover:border-[#C7D2FE] transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Generar Reporte
            </button>
          </div>

          <div className="hp-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Wallet className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#0F172A]">
                Reporte de Nómina
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Base salarial por colaborador, cargo asignado y centro de costos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onExportReport('nomina')}
              className="hp-focus-ring mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-[#EEF2FF] hover:text-[#4F46E5] hover:border-[#C7D2FE] transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Generar Reporte
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
