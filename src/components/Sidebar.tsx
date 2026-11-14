import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarCheck2,
  FileText,
  Flame,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from 'lucide-react';
import type { UserAccount } from '../utils/authLogic';
import type { PageId } from '../utils/hrLogic';
import { Avatar } from './Avatar';

interface SidebarProps {
  activePage: PageId;
  currentUser: UserAccount;
  pendingNovedades: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
}

const NAV_ITEMS: Array<{
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'empleados', label: 'Empleados', icon: Users },
  { id: 'departamentos', label: 'Departamentos', icon: Building2 },
  { id: 'cargos', label: 'Cargos', icon: Briefcase },
  { id: 'asistencia', label: 'Asistencia', icon: CalendarCheck2 },
  { id: 'novedades', label: 'Novedades', icon: FileText },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'freefire', label: 'Videos Free Fire', icon: Flame },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
];

export function Sidebar({
  activePage,
  currentUser,
  pendingNovedades,
  mobileOpen,
  onCloseMobile,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const fullName = `${currentUser.nombre} ${currentUser.apellido}`.trim();

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col bg-white border-r border-[#E2E8F0]">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-white shadow-sm">
            <Users className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-[#0F172A] leading-none">
              HumanPro
            </p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              Gestión RRHH
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Cerrar menú lateral"
          className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`hp-focus-ring w-full flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                  : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-[#0F172A]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 ${
                    isActive ? 'text-[#4F46E5]' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </span>
              {item.id === 'novedades' && pendingNovedades > 0 && (
                <span className="inline-flex items-center justify-center rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800 font-tabular">
                  {pendingNovedades}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile + Salir */}
      <div className="border-t border-[#E2E8F0] p-3.5 space-y-2.5">
        <div className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2.5">
          <Avatar
            src={currentUser.foto}
            nombres={currentUser.nombre}
            apellidos={currentUser.apellido}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#0F172A]">{fullName}</p>
            <p className="truncate text-[11px] text-slate-500">{currentUser.correo}</p>
            {currentUser.provider === 'Google' && (
              <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                ● Conectado con Google
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="hp-focus-ring w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed left rail */}
      <aside
        aria-label="Menú lateral de escritorio"
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-[252px]"
      >
        {navContent}
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside
            aria-label="Menú lateral móvil"
            className="relative z-10 w-[268px] max-w-[85vw] h-full shadow-2xl"
          >
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
