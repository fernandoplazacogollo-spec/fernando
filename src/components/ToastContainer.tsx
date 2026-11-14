import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { container: string; iconColor: string; Icon: typeof CheckCircle2 }
> = {
  success: {
    container: 'bg-white border-emerald-200 text-[#0F172A]',
    iconColor: 'text-emerald-600 bg-emerald-50',
    Icon: CheckCircle2,
  },
  error: {
    container: 'bg-white border-red-200 text-[#0F172A]',
    iconColor: 'text-red-600 bg-red-50',
    Icon: AlertCircle,
  },
  warning: {
    container: 'bg-white border-amber-200 text-[#0F172A]',
    iconColor: 'text-amber-600 bg-amber-50',
    Icon: AlertTriangle,
  },
  info: {
    container: 'bg-white border-indigo-200 text-[#0F172A]',
    iconColor: 'text-[#4F46E5] bg-[#EEF2FF]',
    Icon: Info,
  },
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 w-[calc(100vw-2.5rem)] max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        const style = VARIANT_STYLES[toast.variant];
        const Icon = style.Icon;

        return (
          <div
            key={toast.id}
            role="status"
            className={`hp-toast-enter pointer-events-auto flex items-center gap-3 rounded-xl border px-3.5 py-3 shadow-lg shadow-slate-900/10 ${style.container}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconColor}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="flex-1 text-sm font-medium leading-snug text-[#0F172A]">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Cerrar notificación"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
