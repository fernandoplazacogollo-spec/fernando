import { useState } from 'react';
import { getInitials } from '../utils/hrLogic';

interface AvatarProps {
  src?: string;
  nombres: string;
  apellidos: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-10 w-10 text-xs',
  lg: 'h-16 w-16 text-lg',
};

export function Avatar({
  src,
  nombres,
  apellidos,
  size = 'md',
  className = '',
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const fullName = `${nombres} ${apellidos}`.trim();
  const initials = getInitials(nombres, apellidos);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={fullName}
        onError={() => setImgError(true)}
        className={`${SIZE_CLASSES[size]} shrink-0 rounded-full object-cover ring-1 ring-[#E2E8F0] bg-[#EEF2FF] ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={fullName}
      className={`${SIZE_CLASSES[size]} shrink-0 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-semibold ring-1 ring-[#C7D2FE] flex items-center justify-center select-none ${className}`}
    >
      {initials}
    </div>
  );
}
