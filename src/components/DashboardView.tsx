import {
  ArrowUpRight,
  Building2,
  CalendarCheck2,
  ClipboardList,
  Clock,
  FilePlus2,
  FileSpreadsheet,
  Flame,
  UserPlus,
  Users,
} from 'lucide-react';
import type { ActivityItem, PageId } from '../utils/hrLogic';
import { DepartmentBarChart } from './Charts';

interface DashboardMetrics {
  activeCount: number;
  presentCount: number;
  attendanceRate: number;
  departmentCount: number;
  pendingNovedades: number;
  departmentStats: Array<{
    id: string;
    nombre: string;
    count: number;
    percentage: number;
  }>;
}

interface DashboardViewProps {
  metrics: DashboardMetrics;
  activities: ActivityItem[];
  onOpenCreateEmployee: () => void;
  onNavigate: (page: PageId) => void;
}

const ACTIVITY_BADGE: Record<ActivityItem['tipo'], { label: string; classes: string }> = {
  nominal: { label: 'Completado', classes: 'bg-[#DCFCE7] text-[#166534]' },
  info: { label: 'Actualización', classes: 'bg-[#EEF2FF] text-[#4F46E5]' },
  warning: { label: 'Pendiente', classes: 'bg-[#FEF3C7] text-[#92400E]' },
  alert: { label: 'Alerta', classes: 'bg-[#FEE2E2] text-[#991B1B]' },
};

export function DashboardView({
  metrics,
  activities,
  onOpenCreateEmployee,
  onNavigate,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Dashboard RRHH
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Resumen general del talento humano, asistencia diaria y novedades activas.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateEmployee}
          className="hp-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4338CA] transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Nuevo Empleado
        </button>
      </div>

      {/* 4 KPI Cards */}
      <section aria-label="Indicadores principales" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="hp-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Empleados Activos</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <Users className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <p className="text-3xl font-bold tracking-tight text-[#0F172A] font-tabular">
              {metrics.activeCount}
            </p>
            <span className="inline-flex items-center gap-0.5 rounded-lg bg-[#DCFCE7] px-2 py-0.5 text-xs font-semibold text-[#166534]">
              +12%
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Respecto al trimestre anterior</p>
        </div>

        <div className="hp-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Presentes Hoy</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarCheck2 className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <p className="text-3xl font-bold tracking-tight text-[#0F172A] font-tabular">
              {metrics.presentCount}
            </p>
            <span className="inline-flex items-center rounded-lg bg-[#DCFCE7] px-2 py-0.5 text-xs font-semibold text-[#166534] font-tabular">
              {metrics.attendanceRate}%
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Registro de jornada diaria</p>
        </div>

        <div className="hp-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Departamentos</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Building2 className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <p className="text-3xl font-bold tracking-tight text-[#0F172A] font-tabular">
              {metrics.departmentCount}
            </p>
            <span className="text-xs font-medium text-slate-500">Activos</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Áreas funcionales operativas</p>
        </div>

        <div className="hp-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Novedades Pendientes</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ClipboardList className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <p className="text-3xl font-bold tracking-tight text-[#0F172A] font-tabular">
              {metrics.pendingNovedades}
            </p>
            <span
              className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ${
                metrics.pendingNovedades > 0
                  ? 'bg-[#FEF3C7] text-[#92400E]'
                  : 'bg-[#DCFCE7] text-[#166534]'
              }`}
            >
              {metrics.pendingNovedades > 0 ? 'Por revisar' : 'Al día'}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Solicitudes de personal</p>
        </div>
      </section>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart Card */}
        <section className="hp-card p-6 lg:col-span-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">
                Colaboradores por Departamento
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribución actual de la plantilla por área
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {metrics.departmentStats.map((dept) => (
                <span
                  key={dept.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs text-slate-600 font-tabular"
                >
                  <span className="font-medium text-[#0F172A]">{dept.nombre}:</span>
                  <span>{dept.count}</span>
                </span>
              ))}
            </div>
          </div>

          <DepartmentBarChart data={metrics.departmentStats} />
        </section>

        {/* Quick Actions Card */}
        <section className="hp-card p-6 lg:col-span-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">Accesos rápidos</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ejecuta las tareas frecuentes de RRHH en un clic
            </p>

            <div className="mt-5 grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={onOpenCreateEmployee}
                className="hp-focus-ring group flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-left hover:border-[#4F46E5]/40 hover:bg-[#EEF2FF]/60 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5] text-white">
                    <UserPlus className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#0F172A]">
                      Crear empleado
                    </span>
                    <span className="block text-xs text-slate-500">
                      Registrar nuevo ingreso
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-[#4F46E5]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('asistencia')}
                className="hp-focus-ring group flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-left hover:border-[#4F46E5]/40 hover:bg-[#EEF2FF]/60 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <CalendarCheck2 className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#0F172A]">
                      Registrar asistencia
                    </span>
                    <span className="block text-xs text-slate-500">
                      Control de entradas hoy
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-[#4F46E5]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('novedades')}
                className="hp-focus-ring group flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-left hover:border-[#4F46E5]/40 hover:bg-[#EEF2FF]/60 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                    <FilePlus2 className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#0F172A]">
                      Nueva novedad
                    </span>
                    <span className="block text-xs text-slate-500">
                      Permisos, vacaciones o bonos
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-[#4F46E5]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('reportes')}
                className="hp-focus-ring group flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-left hover:border-[#4F46E5]/40 hover:bg-[#EEF2FF]/60 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-white">
                    <FileSpreadsheet className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#0F172A]">
                      Ver reportes
                    </span>
                    <span className="block text-xs text-slate-500">
                      Analítica y exportación
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-[#4F46E5]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('freefire')}
                className="hp-focus-ring group flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50/70 px-4 py-3 text-left hover:border-orange-400 hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-white">
                    <Flame className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-[#0F172A]">
                      Ver Videos Free Fire
                    </span>
                    <span className="block text-xs text-slate-600">
                      TheDonato, Ronaldo 777 y tus videos
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-orange-500 group-hover:text-orange-700" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Actividad Reciente (5 rows) */}
      <section className="hp-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">Actividad reciente</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Últimos eventos registrados en la plataforma
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            En tiempo real
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Responsable</th>
                <th className="py-3 px-6">Acción</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6 text-right">Momento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-sm">
              {activities.slice(0, 5).map((item) => {
                const badge = ACTIVITY_BADGE[item.tipo];
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#0F172A] whitespace-nowrap">
                      {item.actor}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{item.accion}</td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${badge.classes}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right text-xs font-medium text-slate-500 whitespace-nowrap">
                      {item.tiempo}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
