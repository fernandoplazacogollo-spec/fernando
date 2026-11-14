import { AlertCircle, CheckCircle2, Clock, Save } from 'lucide-react';
import {
  computeAttendanceSummary,
  type AttendanceRecord,
  type AttendanceStatus,
  type Employee,
} from '../utils/hrLogic';
import { Avatar } from './Avatar';

interface AttendanceViewProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  onChangeStatus: (employeeId: number, status: AttendanceStatus) => void;
  onSaveDay: () => void;
}

const ATTENDANCE_BADGE: Record<AttendanceStatus, string> = {
  Presente: 'bg-[#DCFCE7] text-[#166534] border-emerald-200',
  Retardo: 'bg-[#FEF3C7] text-[#92400E] border-amber-200',
  Ausente: 'bg-[#FEE2E2] text-[#991B1B] border-red-200',
  Permiso: 'bg-[#EEF2FF] text-[#4F46E5] border-indigo-200',
};

export function AttendanceView({
  employees,
  attendance,
  onChangeStatus,
  onSaveDay,
}: AttendanceViewProps) {
  const byId = new Map(attendance.map((rec) => [rec.employeeId, rec]));
  const activeEmployees = employees.filter((e) => e.estado === 'Activo');
  const activeRecords = activeEmployees.map(
    (emp) =>
      byId.get(emp.id) ?? {
        employeeId: emp.id,
        entrada: '—',
        salida: '—',
        estado: 'Presente' as AttendanceStatus,
      }
  );
  const summary = computeAttendanceSummary(activeRecords, true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Asistencia</h1>
          <p className="mt-1 text-sm text-slate-500">
            Registro diario de ingresos, retardos y novedades de jornada ({summary.attendanceRate}% cumplimiento).
          </p>
        </div>

        <button
          type="button"
          onClick={onSaveDay}
          className="hp-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#4338CA] transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Guardar Asistencia del Día
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="hp-card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Presentes</p>
            <p className="mt-1 text-3xl font-bold text-[#0F172A] font-tabular">
              {summary.presentes}
            </p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#166534]">
            <CheckCircle2 className="h-5 w-5" />
          </span>
        </div>

        <div className="hp-card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Retardos</p>
            <p className="mt-1 text-3xl font-bold text-[#0F172A] font-tabular">
              {summary.retardos}
            </p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#92400E]">
            <Clock className="h-5 w-5" />
          </span>
        </div>

        <div className="hp-card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Ausentes</p>
            <p className="mt-1 text-3xl font-bold text-[#0F172A] font-tabular">
              {summary.ausentes}
            </p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FEE2E2] text-[#991B1B]">
            <AlertCircle className="h-5 w-5" />
          </span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="hp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Empleado</th>
                <th className="py-3.5 px-4">Departamento</th>
                <th className="py-3.5 px-4">Hora Entrada</th>
                <th className="py-3.5 px-4">Hora Salida</th>
                <th className="py-3.5 px-6 text-right">Estado del Día</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-sm">
              {employees.map((emp) => {
                const record = byId.get(emp.id) ?? {
                  employeeId: emp.id,
                  entrada: '08:02 AM',
                  salida: '—',
                  estado: 'Presente' as AttendanceStatus,
                };
                const fullName = `${emp.nombres} ${emp.apellidos}`;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3 min-w-[190px]">
                        <Avatar
                          src={emp.foto}
                          nombres={emp.nombres}
                          apellidos={emp.apellidos}
                          size="sm"
                        />
                        <div>
                          <p className="font-semibold text-[#0F172A]">{fullName}</p>
                          <p className="text-xs text-slate-500">{emp.cargo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {emp.departamento}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-700 whitespace-nowrap font-tabular">
                      {record.entrada}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 whitespace-nowrap font-tabular">
                      {record.salida}
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <select
                        value={record.estado}
                        onChange={(e) =>
                          onChangeStatus(emp.id, e.target.value as AttendanceStatus)
                        }
                        aria-label={`Estado de asistencia de ${fullName}`}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer ${
                          ATTENDANCE_BADGE[record.estado]
                        }`}
                      >
                        <option value="Presente">Presente</option>
                        <option value="Retardo">Retardo</option>
                        <option value="Ausente">Ausente</option>
                        <option value="Permiso">Permiso</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
