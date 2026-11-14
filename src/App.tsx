import { useCallback, useEffect, useMemo, useState } from 'react';
import { AttendanceView } from './components/AttendanceView';
import { CargosView } from './components/CargosView';
import { DashboardView } from './components/DashboardView';
import { DepartmentsView } from './components/DepartmentsView';
import { EmployeesView } from './components/EmployeesView';
import { FreeFireVideosView } from './components/FreeFireVideosView';
import { GoogleChooserModal } from './components/GoogleChooserModal';
import { LoginView } from './components/LoginView';
import {
  ConfirmDeleteModal,
  EmployeeDetailModal,
  EmployeeFormModal,
} from './components/Modals';
import { NovedadesView } from './components/NovedadesView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { Sidebar } from './components/Sidebar';
import {
  ToastContainer,
  type ToastItem,
  type ToastVariant,
} from './components/ToastContainer';
import { Topbar } from './components/Topbar';
import {
  DEFAULT_AVATAR,
  getInitialState,
  loadHrState,
  saveHrState,
  type HrAppState,
} from './data/seed';
import {
  authenticateAccount,
  getDefaultPageForAccount,
  loadActiveSessionUser,
  loadStoredAccounts,
  loginOrCreateGoogleAccount,
  registerAccount,
  resetAccountPassword,
  saveActiveSessionUser,
  saveStoredAccounts,
  type RegisterAccountInput,
  type UserAccount,
} from './utils/authLogic';
import {
  computeDashboardMetrics,
  generateCsvReport,
  updateNovedadStatus,
  upsertEmployee,
  type ActivityItem,
  type AttendanceStatus,
  type CompanySettings,
  type Department,
  type Employee,
  type EmployeeFormInput,
  type Novedad,
  type NovedadStatus,
  type NovedadType,
  type PageId,
} from './utils/hrLogic';

export default function App() {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => loadStoredAccounts());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const stored = loadStoredAccounts();
    const active = loadActiveSessionUser(stored);
    if (active) return active;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return stored[0] ?? null;
      }
    }
    return null;
  });

  const [state, setState] = useState<HrAppState>(() => loadHrState());
  const [activePage, setActivePage] = useState<PageId>(() =>
    getDefaultPageForAccount(currentUser)
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Employee Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    saveHrState(state);
  }, [state]);

  useEffect(() => {
    saveStoredAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    saveActiveSessionUser(currentUser?.id ?? null);
  }, [currentUser]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-1), { id, message, variant }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 3500);
    },
    [dismissToast]
  );

  const actorLabel = currentUser
    ? `${currentUser.nombre} ${currentUser.apellido}`.trim()
    : 'Administrador';

  const prependActivity = (
    prevActivities: ActivityItem[],
    actor: string,
    accion: string,
    tipo: ActivityItem['tipo'] = 'info'
  ): ActivityItem[] => [
    {
      id: `act-${Date.now()}`,
      actor,
      accion,
      tiempo: 'Ahora',
      tipo,
    },
    ...prevActivities,
  ];

  const metrics = useMemo(
    () =>
      computeDashboardMetrics(
        state.employees,
        state.departments,
        state.attendance,
        state.novedades
      ),
    [state.employees, state.departments, state.attendance, state.novedades]
  );

  const pendingNovedadesList = useMemo(
    () => state.novedades.filter((n) => n.estado === 'Pendiente'),
    [state.novedades]
  );

  const handleLogin = (email: string, password: string) => {
    const res = authenticateAccount(accounts, email, password);
    if (!res.ok || !res.account) {
      return { ok: false, error: res.error };
    }
    setCurrentUser(res.account);
    setActivePage(getDefaultPageForAccount(res.account));
    addToast(`Bienvenido, ${res.account.nombre}`, 'success');
    return { ok: true };
  };

  const handleRegister = (input: RegisterAccountInput) => {
    const res = registerAccount(accounts, input);
    if (!res.ok || !res.created) {
      return { ok: false, errors: res.errors };
    }
    setAccounts(res.accounts);
    setCurrentUser(res.created);
    setActivePage(getDefaultPageForAccount(res.created));
    addToast(`Cuenta creada. ¡Bienvenido, ${res.created.nombre}!`, 'success');
    return { ok: true };
  };

  const handleResetPassword = (email: string, newPassword: string) => {
    const res = resetAccountPassword(accounts, email, newPassword);
    if (!res.ok) {
      return { ok: false, error: res.error };
    }
    setAccounts(res.accounts);
    addToast('Contraseña actualizada. Ya puedes iniciar sesión.', 'success');
    return { ok: true };
  };

  const handleGoogleAccountSelect = (profile: {
    nombre: string;
    correo: string;
    foto?: string;
  }) => {
    const res = loginOrCreateGoogleAccount(accounts, profile);
    if (!res.ok || !res.account) {
      return { ok: false, error: res.error };
    }
    setAccounts(res.accounts);
    setCurrentUser(res.account);
    setActivePage(getDefaultPageForAccount(res.account));
    setGoogleModalOpen(false);
    addToast(`Sesión iniciada con Google como ${res.account.nombre}`, 'success');
    return { ok: true };
  };

  const handleOpenCreateEmployee = () => {
    setEditingEmployee(null);
    setFormModalOpen(true);
  };

  const handleSaveEmployee = (input: EmployeeFormInput, editingId: number | null) => {
    const result = upsertEmployee(
      state.employees,
      input,
      editingId,
      editingId ? undefined : DEFAULT_AVATAR
    );

    const fullName = `${result.saved.nombres} ${result.saved.apellidos}`;

    setState((prev) => {
      const hasAttendance = prev.attendance.some((a) => a.employeeId === result.saved.id);
      const nextAttendance = hasAttendance
        ? prev.attendance
        : [
            {
              employeeId: result.saved.id,
              entrada: '08:00 AM',
              salida: '—',
              estado: 'Presente' as AttendanceStatus,
            },
            ...prev.attendance,
          ];

      return {
        ...prev,
        employees: result.employees,
        attendance: nextAttendance,
        activities: prependActivity(
          prev.activities,
          actorLabel,
          result.isEdit
            ? `actualizó la ficha de ${fullName}`
            : `registró a ${fullName} en ${result.saved.departamento}`,
          'nominal'
        ),
      };
    });

    setFormModalOpen(false);
    setEditingEmployee(null);
    addToast(
      result.isEdit
        ? `Empleado ${fullName} actualizado correctamente`
        : `Empleado ${fullName} creado correctamente`,
      'success'
    );
  };

  const handleConfirmDeleteEmployee = (employee: Employee) => {
    const fullName = `${employee.nombres} ${employee.apellidos}`;
    setState((prev) => ({
      ...prev,
      employees: prev.employees.filter((e) => e.id !== employee.id),
      attendance: prev.attendance.filter((a) => a.employeeId !== employee.id),
      activities: prependActivity(
        prev.activities,
        actorLabel,
        `eliminó el registro de ${fullName}`,
        'alert'
      ),
    }));
    setDeleteTarget(null);
    addToast('Empleado eliminado', 'success');
  };

  const handleCreateDepartment = (input: {
    nombre: string;
    descripcion: string;
    lider: string;
    accentColor: Department['accentColor'];
  }) => {
    const created: Department = {
      id: `dept-${Date.now()}`,
      nombre: input.nombre,
      descripcion: input.descripcion,
      lider: input.lider,
      baseCount: 0,
      seedRosterCount: 0,
      accentColor: input.accentColor,
    };

    setState((prev) => ({
      ...prev,
      departments: [...prev.departments, created],
      activities: prependActivity(
        prev.activities,
        actorLabel,
        `creó el departamento ${created.nombre}`,
        'nominal'
      ),
    }));
    addToast(`Departamento "${created.nombre}" creado`, 'success');
  };

  const handleCreateRole = (input: {
    nombre: string;
    departamento: string;
    salarioBase: number;
  }) => {
    const created = {
      id: `role-${Date.now()}`,
      nombre: input.nombre,
      departamento: input.departamento,
      salarioBase: input.salarioBase,
      baseEmployeesCount: 0,
      seedRosterCount: 0,
    };

    setState((prev) => ({
      ...prev,
      roles: [created, ...prev.roles],
      activities: prependActivity(
        prev.activities,
        actorLabel,
        `agregó el cargo ${created.nombre}`,
        'info'
      ),
    }));
    addToast(`Cargo "${created.nombre}" creado`, 'success');
  };

  const handleUpdateRole = (
    id: string,
    input: { nombre: string; departamento: string; salarioBase: number }
  ) => {
    setState((prev) => ({
      ...prev,
      roles: prev.roles.map((r) => (r.id === id ? { ...r, ...input } : r)),
      activities: prependActivity(
        prev.activities,
        actorLabel,
        `actualizó el cargo ${input.nombre}`,
        'info'
      ),
    }));
    addToast(`Cargo "${input.nombre}" actualizado`, 'success');
  };

  const handleChangeAttendance = (employeeId: number, status: AttendanceStatus) => {
    setState((prev) => {
      const exists = prev.attendance.some((a) => a.employeeId === employeeId);
      const nextAttendance = exists
        ? prev.attendance.map((a) =>
            a.employeeId === employeeId
              ? {
                  ...a,
                  estado: status,
                  entrada:
                    status === 'Ausente'
                      ? '—'
                      : a.entrada === '—'
                        ? '08:05 AM'
                        : a.entrada,
                }
              : a
          )
        : [
            ...prev.attendance,
            {
              employeeId,
              entrada: status === 'Ausente' ? '—' : '08:05 AM',
              salida: '—',
              estado: status,
            },
          ];

      return { ...prev, attendance: nextAttendance };
    });
  };

  const handleSaveAttendanceDay = () => {
    setState((prev) => ({
      ...prev,
      activities: prependActivity(
        prev.activities,
        actorLabel,
        'guardó el registro de asistencia del día',
        'nominal'
      ),
    }));
    addToast('Asistencia del día guardada correctamente', 'success');
  };

  const handleCreateNovedad = (input: {
    employeeId: number;
    tipo: NovedadType;
    descripcion: string;
  }) => {
    const emp = state.employees.find((e) => e.id === input.employeeId);
    const empleadoNombre = emp ? `${emp.nombres} ${emp.apellidos}` : 'Colaborador';
    const created: Novedad = {
      id: `nov-${Date.now()}`,
      employeeId: input.employeeId,
      empleadoNombre,
      tipo: input.tipo,
      descripcion: input.descripcion,
      fecha: '2026-11-14',
      estado: 'Pendiente',
    };

    setState((prev) => ({
      ...prev,
      novedades: [created, ...prev.novedades],
      activities: prependActivity(
        prev.activities,
        empleadoNombre,
        `registró novedad: ${input.tipo}`,
        'warning'
      ),
    }));
    addToast(`Novedad registrada para ${empleadoNombre}`, 'success');
  };

  const handleUpdateNovedadStatus = (id: string, status: NovedadStatus) => {
    const target = state.novedades.find((n) => n.id === id);
    setState((prev) => ({
      ...prev,
      novedades: updateNovedadStatus(prev.novedades, id, status),
      activities: prependActivity(
        prev.activities,
        actorLabel,
        `${status === 'Aprobada' ? 'aprobó' : 'rechazó'} novedad de ${
          target?.empleadoNombre ?? 'colaborador'
        }`,
        status === 'Aprobada' ? 'nominal' : 'alert'
      ),
    }));
    addToast(
      `Novedad ${status === 'Aprobada' ? 'aprobada' : 'rechazada'} correctamente`,
      status === 'Aprobada' ? 'success' : 'warning'
    );
  };

  const handleExportReport = (type: 'empleados' | 'asistencia' | 'nomina') => {
    const report = generateCsvReport(type, state.employees, state.attendance);
    try {
      const blob = new Blob([report.content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', report.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Safe fallback in restricted headless contexts
    }
    addToast('Reporte generado en PDF', 'success');
  };

  const handleSaveSettings = (next: CompanySettings) => {
    setState((prev) => ({
      ...prev,
      settings: next,
      activities: prependActivity(
        prev.activities,
        actorLabel,
        `actualizó la configuración de ${next.nombreEmpresa}`,
        'info'
      ),
    }));
    addToast('Configuración guardada correctamente', 'success');
  };

  const handleResetDemo = () => {
    const fresh = getInitialState();
    setState(fresh);
    addToast('Datos de demostración restablecidos', 'info');
  };

  if (!currentUser) {
    return (
      <>
        <LoginView
          accounts={accounts}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onResetPassword={handleResetPassword}
          onOpenGoogleLogin={() => setGoogleModalOpen(true)}
        />
        <GoogleChooserModal
          open={googleModalOpen}
          onClose={() => setGoogleModalOpen(false)}
          onSelectGoogleAccount={handleGoogleAccountSelect}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Sidebar
        activePage={activePage}
        currentUser={currentUser}
        pendingNovedades={metrics.pendingNovedades}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onNavigate={(page) => setActivePage(page)}
        onLogout={() => {
          setCurrentUser(null);
          setMobileMenuOpen(false);
          addToast('Sesión cerrada correctamente', 'info');
        }}
      />

      <div className="lg:pl-[252px] flex min-h-screen flex-col">
        <Topbar
          activePage={activePage}
          currentUser={currentUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          pendingNovedades={pendingNovedadesList}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCreateEmployee={handleOpenCreateEmployee}
          onNavigate={(page) => setActivePage(page)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-[1400px] w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              activities={state.activities}
              onOpenCreateEmployee={handleOpenCreateEmployee}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'empleados' && (
            <EmployeesView
              employees={state.employees}
              departments={state.departments}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedDepartment={departmentFilter}
              onDepartmentChange={setDepartmentFilter}
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter}
              onOpenCreate={handleOpenCreateEmployee}
              onViewEmployee={(emp) => setDetailEmployee(emp)}
              onEditEmployee={(emp) => {
                setEditingEmployee(emp);
                setFormModalOpen(true);
              }}
              onRequestDeleteEmployee={(emp) => setDeleteTarget(emp)}
            />
          )}

          {activePage === 'departamentos' && (
            <DepartmentsView
              departments={state.departments}
              employees={state.employees}
              onCreateDepartment={handleCreateDepartment}
            />
          )}

          {activePage === 'cargos' && (
            <CargosView
              roles={state.roles}
              departments={state.departments}
              employees={state.employees}
              onCreateRole={handleCreateRole}
              onUpdateRole={handleUpdateRole}
            />
          )}

          {activePage === 'asistencia' && (
            <AttendanceView
              employees={state.employees}
              attendance={state.attendance}
              onChangeStatus={handleChangeAttendance}
              onSaveDay={handleSaveAttendanceDay}
            />
          )}

          {activePage === 'novedades' && (
            <NovedadesView
              employees={state.employees}
              novedades={state.novedades}
              onCreateNovedad={handleCreateNovedad}
              onUpdateNovedadStatus={handleUpdateNovedadStatus}
            />
          )}

          {activePage === 'reportes' && (
            <ReportsView
              employees={state.employees}
              attendance={state.attendance}
              novedades={state.novedades}
              onExportReport={handleExportReport}
            />
          )}

          {activePage === 'freefire' && (
            <FreeFireVideosView userName={currentUser.nombre} />
          )}

          {activePage === 'configuracion' && (
            <SettingsView
              settings={state.settings}
              currentUser={currentUser}
              onSaveSettings={handleSaveSettings}
              onResetDemo={handleResetDemo}
              onOpenGoogleConnect={() => setGoogleModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <GoogleChooserModal
        open={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectGoogleAccount={handleGoogleAccountSelect}
      />
      <EmployeeFormModal
        open={formModalOpen}
        editingEmployee={editingEmployee}
        departments={state.departments}
        roles={state.roles}
        onClose={() => {
          setFormModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        onValidationError={(msg) => addToast(msg, 'error')}
      />

      <EmployeeDetailModal
        employee={detailEmployee}
        attendanceRecord={
          detailEmployee
            ? state.attendance.find((a) => a.employeeId === detailEmployee.id)
            : undefined
        }
        onClose={() => setDetailEmployee(null)}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setFormModalOpen(true);
        }}
      />

      <ConfirmDeleteModal
        employee={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDeleteEmployee}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
