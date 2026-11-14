import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Flame,
  Link2,
  Play,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  buildCustomVideoEntry,
  buildYouTubePlayerCommand,
  FREE_FIRE_VIDEOS,
  filterFreeFireVideos,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  getYouTubeWatchUrl,
  loadCustomVideos,
  saveCustomVideos,
  type FreeFireCreator,
  type FreeFireVideo,
} from '../utils/freeFireVideos';

interface FreeFireVideosViewProps {
  userName: string;
}

export function FreeFireVideosView({ userName }: FreeFireVideosViewProps) {
  const [customVideos, setCustomVideos] = useState<FreeFireVideo[]>(() => loadCustomVideos());
  const allVideos = useMemo(
    () => [...customVideos, ...FREE_FIRE_VIDEOS],
    [customVideos]
  );

  const [creatorFilter, setCreatorFilter] = useState<'Todos' | FreeFireCreator>('Todos');
  const [query, setQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<FreeFireVideo>(() => allVideos[0]);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [videoCreatorInput, setVideoCreatorInput] = useState<FreeFireCreator>('TheDonato');
  const [addError, setAddError] = useState<string | null>(null);

  const playerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const embedOrigin =
    typeof window !== 'undefined' ? window.location.origin : undefined;

  useEffect(() => {
    saveCustomVideos(customVideos);
  }, [customVideos]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = isMuted;
    videoEl.volume = Math.max(0, Math.min(1, volume / 100));
  }, [isMuted, volume, activeVideo.id]);

  const sendYouTubeAudioSync = (
    targetMuted: boolean,
    targetVolume: number,
    alsoPlay = false
  ) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ event: 'listening' }), '*');
    win.postMessage(
      buildYouTubePlayerCommand(targetMuted ? 'mute' : 'unMute'),
      '*'
    );
    win.postMessage(
      buildYouTubePlayerCommand('setVolume', [targetVolume]),
      '*'
    );
    if (alsoPlay) {
      win.postMessage(buildYouTubePlayerCommand('playVideo'), '*');
    }
  };

  const applyAudioState = (
    nextMuted: boolean,
    nextVolume: number,
    alsoPlay = false
  ) => {
    const safeVolume = Math.max(0, Math.min(100, nextVolume));
    setIsMuted(nextMuted);
    setVolume(safeVolume);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = safeVolume / 100;
      if (alsoPlay) {
        void videoRef.current.play().catch(() => {});
      }
    }

    if (activeVideo.sourceType === 'youtube') {
      sendYouTubeAudioSync(nextMuted, safeVolume, alsoPlay);
    }
  };

  const handleIframeLoad = () => {
    sendYouTubeAudioSync(isMuted, volume, autoPlay);
    window.setTimeout(() => {
      sendYouTubeAudioSync(isMuted, volume, autoPlay);
    }, 350);
  };

  const filteredVideos = useMemo(
    () => filterFreeFireVideos(allVideos, creatorFilter, query),
    [allVideos, creatorFilter, query]
  );

  const donatoCount = useMemo(
    () => allVideos.filter((v) => v.creator === 'TheDonato').length,
    [allVideos]
  );
  const ronaldoCount = useMemo(
    () => allVideos.filter((v) => v.creator === 'Ronaldo 777').length,
    [allVideos]
  );

  const activeIndex = filteredVideos.findIndex((v) => v.id === activeVideo.id);

  const handleSelectVideo = (video: FreeFireVideo) => {
    const restoredVol = volume > 0 ? volume : 100;
    setActiveVideo(video);
    setAutoPlay(true);
    setIsMuted(false);
    setVolume(restoredVol);
    if (video.id === activeVideo.id) {
      applyAudioState(false, restoredVol, true);
    }
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleStepVideo = (direction: -1 | 1) => {
    const pool = filteredVideos.length > 0 ? filteredVideos : allVideos;
    const currentIdx = pool.findIndex((v) => v.id === activeVideo.id);
    const nextIdx =
      currentIdx === -1
        ? 0
        : (currentIdx + direction + pool.length) % pool.length;
    const restoredVol = volume > 0 ? volume : 100;
    setActiveVideo(pool[nextIdx]);
    setAutoPlay(true);
    setIsMuted(false);
    setVolume(restoredVol);
  };

  const handleAddUrlVideo = (e: FormEvent) => {
    e.preventDefault();
    const res = buildCustomVideoEntry({
      url: videoUrlInput,
      title: videoTitleInput,
      creator: videoCreatorInput,
    });
    if (!res.ok || !res.video) {
      setAddError(res.error ?? 'No se pudo agregar el video.');
      return;
    }
    setCustomVideos((prev) => [res.video!, ...prev]);
    setActiveVideo(res.video);
    setAutoPlay(true);
    setIsMuted(false);
    setCreatorFilter('Todos');
    setVideoUrlInput('');
    setVideoTitleInput('');
    setAddError(null);
    setAddPanelOpen(false);
  };

  const handleUploadVideoFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const uploaded: FreeFireVideo = {
      id: `local-file-${Date.now()}`,
      sourceType: 'video',
      videoUrl: objectUrl,
      title: file.name.replace(/\.[^.]+$/, ''),
      creator: 'Mi Video',
      category: 'Archivo subido',
      format: 'Archivo',
      description: `Video local (${(file.size / (1024 * 1024)).toFixed(1)} MB) reproducido directamente en la aplicación.`,
      isCustom: true,
    };
    setCustomVideos((prev) => [uploaded, ...prev]);
    setActiveVideo(uploaded);
    setAutoPlay(true);
    setIsMuted(false);
    setCreatorFilter('Todos');
    setAddError(null);
    setAddPanelOpen(false);
    e.target.value = '';
  };

  const handleRemoveCustomVideo = (id: string) => {
    setCustomVideos((prev) => {
      const next = prev.filter((v) => v.id !== id);
      if (activeVideo.id === id) {
        setActiveVideo(next[0] ?? FREE_FIRE_VIDEOS[0]);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header + Creator Filters + Add Video CTA */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-2.5 py-1 text-xs font-semibold text-orange-700 mb-2">
            <Flame className="h-3.5 w-3.5 text-orange-600" />
            Zona Free Fire · Bienvenido, {userName}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Videos de Free Fire — TheDonato y Ronaldo 777
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Reproduce videos directamente en la app o agrega cualquier enlace de YouTube o video MP4 desde tu dispositivo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCreatorFilter('Todos')}
            className={`hp-focus-ring rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              creatorFilter === 'Todos'
                ? 'bg-[#4F46E5] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            Todos ({allVideos.length})
          </button>
          <button
            type="button"
            onClick={() => setCreatorFilter('TheDonato')}
            className={`hp-focus-ring rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              creatorFilter === 'TheDonato'
                ? 'bg-[#4F46E5] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            TheDonato ({donatoCount})
          </button>
          <button
            type="button"
            onClick={() => setCreatorFilter('Ronaldo 777')}
            className={`hp-focus-ring rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              creatorFilter === 'Ronaldo 777'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            Ronaldo 777 ({ronaldoCount})
          </button>

          <button
            type="button"
            onClick={() => {
              setAddError(null);
              setAddPanelOpen((prev) => !prev);
            }}
            className="hp-focus-ring inline-flex items-center gap-1.5 rounded-xl bg-[#16A34A] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#15803D] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Agregar video
          </button>
        </div>
      </div>

      {/* Add YouTube Link or Local MP4 Panel */}
      {addPanelOpen && (
        <section
          aria-label="Agregar video a la aplicación"
          className="hp-card p-5 border-[#4F46E5]/30 bg-white space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                Agregar o subir un video para ver aquí
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pega un enlace de YouTube (Donato, Ronaldo 777 u otro) o sube un video MP4/WebM de tu dispositivo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddPanelOpen(false)}
              aria-label="Cerrar panel de agregar video"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {addError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs text-red-700">
              {addError}
            </div>
          )}

          <form onSubmit={handleAddUrlVideo} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5">
              <label
                htmlFor="video-url-input"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Enlace de YouTube o URL de video *
              </label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="video-url-input"
                  type="text"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... o .mp4"
                  className="hp-input w-full rounded-xl py-2.5 pl-9 pr-3 text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label
                htmlFor="video-title-input"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Título (opcional)
              </label>
              <input
                id="video-title-input"
                type="text"
                value={videoTitleInput}
                onChange={(e) => setVideoTitleInput(e.target.value)}
                placeholder="Partida épica Free Fire"
                className="hp-input w-full rounded-xl px-3 py-2.5 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="video-creator-select"
                className="block text-xs font-semibold text-[#0F172A] mb-1"
              >
                Creador
              </label>
              <select
                id="video-creator-select"
                value={videoCreatorInput}
                onChange={(e) => setVideoCreatorInput(e.target.value as FreeFireCreator)}
                className="hp-input w-full rounded-xl px-3 py-2.5 text-sm bg-white"
              >
                <option value="TheDonato">TheDonato</option>
                <option value="Ronaldo 777">Ronaldo 777</option>
                <option value="Mi Video">Mi Video</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4338CA] cursor-pointer"
              >
                Reproducir
              </button>
            </div>
          </form>

          <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              ¿Tienes un video guardado en tu computador o celular?
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleUploadVideoFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-slate-100 cursor-pointer"
            >
              <Upload className="h-4 w-4 text-[#4F46E5]" />
              Subir video desde mi dispositivo (MP4 / WebM)
            </button>
          </div>
        </section>
      )}

      {/* Featured Embedded / Native Video Player */}
      <section
        ref={playerRef}
        aria-label="Reproductor destacado de Free Fire"
        className="hp-card overflow-hidden scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 bg-[#0F172A] flex flex-col">
            <div className="relative w-full aspect-video">
              {activeVideo.sourceType === 'video' && activeVideo.videoUrl ? (
                <video
                  ref={videoRef}
                  key={activeVideo.videoUrl}
                  src={activeVideo.videoUrl}
                  controls
                  playsInline
                  autoPlay={autoPlay}
                  muted={isMuted}
                  onLoadedMetadata={(e) => {
                    e.currentTarget.muted = isMuted;
                    e.currentTarget.volume = Math.max(0, Math.min(1, volume / 100));
                  }}
                  className="h-full w-full bg-black object-contain"
                />
              ) : (
                <iframe
                  ref={iframeRef}
                  key={activeVideo.youtubeId}
                  src={getYouTubeEmbedUrl(activeVideo.youtubeId ?? '', {
                    autoplay: autoPlay,
                    muted: isMuted,
                    origin: embedOrigin,
                  })}
                  title={activeVideo.title}
                  onLoad={handleIframeLoad}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              )}
            </div>

            {/* Sound & Volume Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border-t border-slate-800 px-4 py-2.5 text-xs text-slate-200">
              <button
                type="button"
                onClick={() => {
                  if (isMuted || volume === 0) {
                    applyAudioState(false, volume > 0 ? volume : 100, false);
                  } else {
                    applyAudioState(true, volume, false);
                  }
                }}
                aria-label={isMuted ? 'Activar sonido del video' : 'Silenciar sonido del video'}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                  isMuted || volume === 0
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                }`}
              >
                {isMuted || volume === 0 ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    Activar sonido
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    Sonido activo
                  </>
                )}
              </button>

              <div className="flex items-center gap-2.5">
                <label htmlFor="video-volume-slider" className="text-slate-300 font-medium">
                  Volumen
                </label>
                <input
                  id="video-volume-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const nextVol = Number(e.target.value);
                    applyAudioState(nextVol === 0, nextVol, false);
                  }}
                  aria-label="Volumen del video"
                  className="w-24 sm:w-32 accent-orange-500 cursor-pointer"
                />
                <span className="w-9 text-right font-semibold font-tabular text-slate-100">
                  {isMuted ? 0 : volume}%
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between bg-white border-t lg:border-t-0 lg:border-l border-[#E2E8F0]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                    activeVideo.creator === 'TheDonato'
                      ? 'bg-[#EEF2FF] text-[#4F46E5]'
                      : activeVideo.creator === 'Ronaldo 777'
                        ? 'bg-orange-50 text-orange-700'
                        : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {activeVideo.creator}
                </span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {activeVideo.category}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold leading-snug text-[#0F172A]">
                {activeVideo.title}
              </h2>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {activeVideo.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] space-y-3">
              <button
                type="button"
                onClick={() => {
                  const nextVol = volume > 0 ? volume : 100;
                  setAutoPlay(true);
                  applyAudioState(false, nextVol, true);
                }}
                className="hp-focus-ring w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-orange-700 transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Reproducir con sonido aquí
              </button>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleStepVideo(-1)}
                  className="hp-focus-ring flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => handleStepVideo(1)}
                  className="hp-focus-ring flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#4F46E5] px-3 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] cursor-pointer"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {activeVideo.sourceType === 'youtube' && (
                <a
                  href={getYouTubeWatchUrl(activeVideo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-slate-100 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                  Ver en YouTube{' '}
                  {activeIndex >= 0 ? `(${activeIndex + 1}/${filteredVideos.length})` : ''}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search & Video Catalog Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-bold text-[#0F172A]">
            Catálogo de videos ({filteredVideos.length})
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar AWM, sensibilidad, Donato..."
              aria-label="Buscar videos de Free Fire"
              className="hp-input w-full rounded-xl py-2 pl-10 pr-3.5 text-sm"
            />
          </div>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="hp-card p-10 text-center">
            <p className="text-sm font-semibold text-[#0F172A]">
              No se encontraron videos con ese filtro.
            </p>
            <button
              type="button"
              onClick={() => {
                setCreatorFilter('Todos');
                setQuery('');
              }}
              className="mt-3 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] cursor-pointer"
            >
              Mostrar todos los videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredVideos.map((video) => {
              const isSelected = video.id === activeVideo.id;
              return (
                <div
                  key={video.id}
                  className={`group relative rounded-2xl border bg-white overflow-hidden transition-all flex flex-col ${
                    isSelected
                      ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20 shadow-md'
                      : 'border-[#E2E8F0] shadow-xs hover:border-[#4F46E5]/50 hover:shadow-md'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectVideo(video)}
                    aria-pressed={isSelected}
                    className="text-left flex-1 flex flex-col cursor-pointer"
                  >
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      {video.sourceType === 'youtube' && video.youtubeId ? (
                        <img
                          src={getYouTubeThumbnailUrl(video.youtubeId)}
                          alt={video.title}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900 text-white gap-1.5">
                          <Film className="h-8 w-8 text-indigo-400" />
                          <span className="text-[11px] font-medium text-slate-300">
                            Video local MP4
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      <span
                        className={`absolute top-2.5 left-2.5 rounded-lg px-2 py-0.5 text-[11px] font-bold ${
                          video.creator === 'TheDonato'
                            ? 'bg-[#4F46E5] text-white'
                            : video.creator === 'Ronaldo 777'
                              ? 'bg-orange-600 text-white'
                              : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {video.creator}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-slate-950/80 px-2 py-1 text-[11px] font-semibold text-white">
                        <Play className="h-3 w-3 fill-current" />
                        {isSelected ? 'En reproducción' : video.format}
                      </span>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#0F172A] line-clamp-2 leading-snug group-hover:text-[#4F46E5] transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-xs text-slate-500">{video.category}</p>
                    </div>
                  </button>

                  {video.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomVideo(video.id)}
                      aria-label={`Quitar video ${video.title}`}
                      className="absolute top-2 right-2 rounded-lg bg-slate-950/75 p-1.5 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
