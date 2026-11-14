export type FreeFireCreator = 'TheDonato' | 'Ronaldo 777' | 'Mi Video';

export interface FreeFireVideo {
  id: string;
  sourceType: 'youtube' | 'video';
  youtubeId?: string;
  videoUrl?: string;
  title: string;
  creator: FreeFireCreator;
  category: string;
  format: 'Video' | 'Short' | 'Archivo';
  description: string;
  isCustom?: boolean;
}

const CUSTOM_VIDEOS_STORAGE_KEY = 'humanpro_custom_videos_v1';

export const FREE_FIRE_VIDEOS: FreeFireVideo[] = [
  {
    id: 'ff-donato-1',
    sourceType: 'youtube',
    youtubeId: '9bno27_w9Jg',
    title: 'CONSIGO LA NUEVA AWM EVOLUTIVA AL MÁXIMO EN FREE FIRE !!',
    creator: 'TheDonato',
    category: 'Armas Evolutivas',
    format: 'Video',
    description:
      'TheDonato sube al máximo nivel la AWM Evolutiva y la pone a prueba en partidas intensas de Free Fire.',
  },
  {
    id: 'ff-ronaldo-1',
    sourceType: 'youtube',
    youtubeId: 'Vu6Pg9Oveuc',
    title: 'SENSIBILIDAD ACTUALIZADA para dar TODO ROJO en FREE FIRE',
    creator: 'Ronaldo 777',
    category: 'Sensibilidad & Todo Rojo',
    format: 'Video',
    description:
      'Configuración completa de sensibilidad y puntería de Ronaldo 777 para pegar todo rojo en clasificatoria.',
  },
  {
    id: 'ff-donato-2',
    sourceType: 'youtube',
    youtubeId: 'bM2m_8CldwA',
    title: 'EL GRAN MAESTRO SERÁ MÍO EN ESTA TEMPORADA DE FREE FIRE !!',
    creator: 'TheDonato',
    category: 'Clasificatoria',
    format: 'Video',
    description:
      'Camino a Gran Maestro con jugadas decisivas, estrategia en escuadra y enfrentamientos de alto nivel.',
  },
  {
    id: 'ff-ronaldo-2',
    sourceType: 'youtube',
    youtubeId: 'Y8z6IAKCBRE',
    title: 'SENSIBILIDAD para PEGAR TODO ROJO | Ronaldo 777',
    creator: 'Ronaldo 777',
    category: 'Sensibilidad & Todo Rojo',
    format: 'Video',
    description:
      'Ajustes clave y demostración en sala con disparos a la cabeza al estilo de Ronaldo 777.',
  },
  {
    id: 'ff-donato-3',
    sourceType: 'youtube',
    youtubeId: 'tQUPbl_x0JE',
    title: '¿PODRÉ CONSEGUIR 1000 PUNTOS EN CLASIFICATORIA Y LLEGAR A GRAN MAESTRO?',
    creator: 'TheDonato',
    category: 'Retos',
    format: 'Video',
    description:
      'Reto épico sumando puntos en BR-Clasificatoria para alcanzar el rango Gran Maestro en Free Fire.',
  },
  {
    id: 'ff-ronaldo-3',
    sourceType: 'youtube',
    youtubeId: 'ssCPt0FgQSg',
    title: 'ASÍ SORPRENDÍ A ESTOS SEGUIDORES en FREE FIRE | Ronaldo 777',
    creator: 'Ronaldo 777',
    category: 'Comunidad',
    format: 'Video',
    description:
      'Ronaldo 777 sorprende a sus seguidores dentro del juego con partidas personalizadas y momentos épicos.',
  },
  {
    id: 'ff-donato-4',
    sourceType: 'youtube',
    youtubeId: 'kk69hi_uMlI',
    title: 'COMPRÉ UNA CUENTA CON 15.000.000 MILLONES DE DIAMANTES EN FREE FIRE !!',
    creator: 'TheDonato',
    category: 'Eventos & Diamantes',
    format: 'Video',
    description:
      'Recorrido por una cuenta cargada de diamantes, skins exclusivas y colecciones legendarias.',
  },
  {
    id: 'ff-ronaldo-4',
    sourceType: 'youtube',
    youtubeId: '1O7Xjs3DJT0',
    title: 'ENCUENTRO IMPOSIBLE #freefire #ronaldo777',
    creator: 'Ronaldo 777',
    category: 'Highlights',
    format: 'Short',
    description:
      'Clip rápido de un encuentro imposible en Free Fire con reacción y jugada clave de Ronaldo 777.',
  },
];

export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const vParam = parsed.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;

      const parts = parsed.pathname.split('/').filter(Boolean);
      if (
        (parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live') &&
        parts[1] &&
        /^[a-zA-Z0-9_-]{11}$/.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function buildCustomVideoEntry(input: {
  url: string;
  title?: string;
  creator?: FreeFireCreator;
}): { ok: boolean; video?: FreeFireVideo; error?: string } {
  const cleanUrl = input.url.trim();
  if (!cleanUrl) {
    return { ok: false, error: 'Pega un enlace de YouTube o una URL de video (.mp4 / .webm).' };
  }

  const ytId = extractYouTubeId(cleanUrl);
  if (ytId) {
    return {
      ok: true,
      video: {
        id: `custom-yt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sourceType: 'youtube',
        youtubeId: ytId,
        title: input.title?.trim() || 'Video de YouTube agregado',
        creator: input.creator || 'Mi Video',
        category: 'Agregado por ti',
        format: cleanUrl.includes('/shorts/') ? 'Short' : 'Video',
        description: 'Video de YouTube agregado para reproducir directamente en la aplicación.',
        isCustom: true,
      },
    };
  }

  if (/^(https?:\/\/|blob:)/i.test(cleanUrl)) {
    return {
      ok: true,
      video: {
        id: `custom-mp4-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sourceType: 'video',
        videoUrl: cleanUrl,
        title: input.title?.trim() || 'Video reproducido en la aplicación',
        creator: input.creator || 'Mi Video',
        category: 'Reproductor local',
        format: 'Archivo',
        description: 'Video reproducido con el reproductor HTML5 integrado.',
        isCustom: true,
      },
    };
  }

  return {
    ok: false,
    error: 'Enlace no reconocido. Pega un enlace válido de YouTube o una URL de video.',
  };
}

export function filterFreeFireVideos(
  videos: FreeFireVideo[],
  creator: 'Todos' | FreeFireCreator,
  query: string
): FreeFireVideo[] {
  const cleanQuery = query.trim().toLowerCase();
  return videos.filter((video) => {
    const matchesCreator = creator === 'Todos' || video.creator === creator;
    if (!matchesCreator) return false;
    if (!cleanQuery) return true;
    return (
      video.title.toLowerCase().includes(cleanQuery) ||
      video.creator.toLowerCase().includes(cleanQuery) ||
      video.category.toLowerCase().includes(cleanQuery) ||
      video.description.toLowerCase().includes(cleanQuery)
    );
  });
}

export interface YouTubeEmbedOptions {
  autoplay?: boolean;
  muted?: boolean;
  origin?: string;
}

export function getYouTubeEmbedUrl(
  youtubeId: string,
  optionsOrAutoplay: boolean | YouTubeEmbedOptions = false
): string {
  const opts: YouTubeEmbedOptions =
    typeof optionsOrAutoplay === 'boolean'
      ? { autoplay: optionsOrAutoplay }
      : optionsOrAutoplay;

  const params = new URLSearchParams({
    rel: '0',
    playsinline: '1',
    enablejsapi: '1',
    mute: opts.muted ? '1' : '0',
  });

  if (opts.autoplay) {
    params.set('autoplay', '1');
  }
  if (opts.origin) {
    params.set('origin', opts.origin);
  }

  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
}

export function buildYouTubePlayerCommand(
  func: 'playVideo' | 'pauseVideo' | 'mute' | 'unMute' | 'setVolume',
  args: unknown[] = []
): string {
  return JSON.stringify({ event: 'command', func, args });
}

export function getYouTubeThumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function getYouTubeWatchUrl(video: FreeFireVideo): string {
  if (video.sourceType === 'video' && video.videoUrl) {
    return video.videoUrl;
  }
  const id = video.youtubeId ?? '';
  return video.format === 'Short'
    ? `https://www.youtube.com/shorts/${id}`
    : `https://www.youtube.com/watch?v=${id}`;
}

export function loadCustomVideos(): FreeFireVideo[] {
  try {
    const raw = window.localStorage.getItem(CUSTOM_VIDEOS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Blob URLs cannot survive page reloads, so only restore persisted remote/YouTube items
    return (parsed as FreeFireVideo[]).filter(
      (v) => v.sourceType === 'youtube' || (v.videoUrl && !v.videoUrl.startsWith('blob:'))
    );
  } catch {
    return [];
  }
}

export function saveCustomVideos(videos: FreeFireVideo[]): void {
  try {
    const persistable = videos.filter(
      (v) => v.isCustom && (v.sourceType === 'youtube' || !v.videoUrl?.startsWith('blob:'))
    );
    window.localStorage.setItem(CUSTOM_VIDEOS_STORAGE_KEY, JSON.stringify(persistable));
  } catch {
    // Ignore storage errors
  }
}
