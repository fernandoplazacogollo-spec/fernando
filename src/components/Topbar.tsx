import { useEffect, useRef, useState } from 'react';
import { Bell, Menu, Plus, Search } from 'lucide-react';
import type { UserAccount } from '../utils/authLogic';
import type { Novedad, PageId } from '../utils/hrLogic';
import { Avatar } from './Avatar';

interface TopbarProps {
  activePage: PageId;
  currentUser: UserAccount;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  pendingNovedades: Novedad[];
  onOpenMobileMenu: () => void;
  onOpenCreateEmployee: () => void;
  onNavigate: (page: PageId) => void;
}

const PAGE_LABELS: Record<PageId, string> = {
  dashboard: 'Dashboard',
  empleados: 'Empleados',
  departamentos: 'Departamentos',
  cargos: 'Cargos',
  asistencia: 'Asistencia',
  novedades: 'Novedades',
  reportes: 'Reportes',
  freefire: 'Videos Free Fire',
  configuracion: 'Configuración',
};

export function Topbar({
  activePage,
  currentUser,
  searchQuery,
  onSearchChange,
  pendingNovedades,
  onOpenMobileMenu,
  onOpenCreateEmployee,
  onNavigate,
}: TopbarProps) {
  const fullName = `${currentUser.nombre} ${currentUser.apellido}`.trim();
  const [notifOpen, setNotifOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-[#E2E8F0] bg-white/95 backdrop-blur px-4 sm:px-6">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Abrir menú"
          className="lg:hidden rounded-xl border border-[#E2E8F0] bg-white p-2 text-slate-600 hover:bg-slate-50"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block shrink-0">
          <span className="text-xs font-medium text-slate-400">HumanPro</span>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="text-sm font-semibold text-[#0F172A]">
            {PAGE_LABELS[activePage]}
          </span>
        </div>

        {/* Global Search */}
        <div className="relative flex-1 max-w-md sm:ml-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (activePage !== 'empleados' && e.target.value.trim()) {
                onNavigate('empleados');
              }
            }}
            placeholder="Buscar empleado, documento o cargo..."
            aria-label="Buscar en HumanPro"
            className="hp-input w-full rounded-xl py-2 pl-10 pr-3.5 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {activePage !== 'empleados' && (
          <button
            type="button"
            onClick={onOpenCreateEmployee}
            className="hp-focus-ring hidden md:inline-flex items-center gap-1.5 rounded-xl bg-[#4F46E5] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4338CA] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Nuevo Empleado
          </button>
        )}

        {/* Notification Bell with red indicator */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((prev) => !prev)}
            aria-label="Notificaciones"
            className="hp-focus-ring relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            {pendingNovedades.length > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
              />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xl shadow-slate-900/10 z-50">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
                <p className="text-sm font-semibold text-[#0F172A]">Notificaciones</p>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {pendingNovedades.length} pendientes
                </span>
              </div>

              <div className="mt-2.5 space-y-2 max-h-60 overflow-y-auto">
                {pendingNovedades.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-500">
                    No hay novedades pendientes por aprobar.
                  </p>
                ) : (
                  pendingNovedades.map((nov) => (
                    <button
                      key={nov.id}
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        onNavigate('novedades');
                      }}
                      className="w-full text-left rounded-xl p-2.5 hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[#0F172A] truncate">
                          {nov.empleadoNombre}
                        </p>
                        <span className="text-[11px] font-medium text-[#4F46E5] shrink-0">
                          {nov.tipo}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                        {nov.descripcion}
                      </p>
                    </button>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setNotifOpen(false);
                  onNavigate('novedades');
                }}
                className="mt-3 w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] py-2 text-xs font-semibold text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors cursor-pointer"
              >
                Ir a Novedades
              </button>
            </div>
          )}
        </div>

        {/* Active User Profile */}
        <div className="flex items-center gap-2.5 pl-1">
          <Avatar
            src={currentUser.foto}
            nombres={currentUser.nombre}
            apellidos={currentUser.apellido}
            size="sm"
          />
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-[#0F172A]">{fullName}</p>
            <p className="text-[11px] text-slate-500">
              {currentUser.provider === 'Google'
                ? 'Conectado con Google'
                : currentUser.cargo}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
