import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import LogoutButton from '@/components/LogoutButton';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  AtSign,
  Download,
  Info,
  CheckCircle2,
  MonitorPlay,
  Gamepad2,
  ExternalLink,
  Laptop,
} from 'lucide-react';

interface StreamerRecord {
  is_active?: boolean | null;
  hwid?: string | null;
  tiktok_username?: string | null;
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch streamer license and HWID from supabase
  const { data: streamerData } = await supabase
    .from('streamers')
    .select('is_active, hwid, tiktok_username')
    .or(`email.eq.${user.email},id.eq.${user.id}`)
    .maybeSingle();

  const streamer = (streamerData as StreamerRecord) || null;

  const tiktokHandle =
    (user.user_metadata?.tiktok_username as string) ||
    streamer?.tiktok_username ||
    '@streamer_live';

  const isActive = Boolean(streamer?.is_active);
  const hwid = streamer?.hwid || null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dashboard Header Bar */}
      <header className="border-b border-white/8 bg-[#020409]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00f0ff]/20 to-[#ff2a5f]/20 border border-[#00f0ff]/40 p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#020409]">
                <Sparkles className="h-5 w-5 text-[#00f0ff]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white">
                Galactic{' '}
                <span className="bg-gradient-to-r from-[#00f0ff] to-[#ff2a5f] bg-clip-text text-transparent">
                  Live
                </span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Streamer Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white truncate max-w-[200px]">
                {user.email}
              </span>
              <span className="text-[11px] font-mono text-[#00f0ff]">{tiktokHandle}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-3 py-1 text-xs font-semibold text-[#00f0ff] mb-2">
                <span className="h-2 w-2 rounded-full bg-[#00f0ff] animate-ping" />
                <span>Panel Streamer Activo</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Bienvenido,{' '}
                <span className="bg-gradient-to-r from-[#00f0ff] to-[#ff2a5f] bg-clip-text text-transparent">
                  {tiktokHandle}
                </span>
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Gestiona tu licencia comercial, verifica tu HWID y descarga la suite de Galactic Live.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/GalacticLive-Setup.exe"
                download="GalacticLive-Setup.exe"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#ff2a5f] px-5 py-2.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-transform hover:scale-105"
              >
                <Download className="h-4 w-4 text-black stroke-[2.5]" />
                <span>Descargar Suite</span>
              </a>
            </div>
          </div>

          {/* Important Info Notice */}
          <div className="rounded-2xl border border-[#00f0ff]/30 bg-[#00f0ff]/5 p-5 backdrop-blur-xl flex items-start gap-4 shadow-[0_0_25px_rgba(0,240,255,0.08)]">
            <Info className="h-6 w-6 text-[#00f0ff] shrink-0 mt-0.5" />
            <div className="text-sm">
              <h3 className="font-bold text-white">Vinculación de Hardware</h3>
              <p className="mt-1 text-zinc-300">
                Tu HWID se vincula automáticamente la primera vez que inicias Galactic Live en tu PC.
                No requieres ingresar llaves manuales: solo inicia sesión dentro de la aplicación de escritorio.
              </p>
            </div>
          </div>

          {/* Cards Grid: License & HWID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Estado de Licencia */}
            <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Estado de Licencia
                </span>
                {isActive ? (
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                ) : (
                  <ShieldAlert className="h-6 w-6 text-[#fbbf24]" />
                )}
              </div>

              <div className="my-3">
                {isActive ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-sm font-bold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LICENCIA ACTIVA</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#fbbf24]/40 bg-[#fbbf24]/10 px-3.5 py-1 text-sm font-bold text-[#fbbf24]">
                    <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
                    <span>PERIODO BETA / PENDIENTE</span>
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                {isActive
                  ? 'Tu cuenta cuenta con acceso ilimitado a todos los módulos: Overlays OBS, TikTok Live Engine y Triggers RCON.'
                  : 'Tu cuenta está registrada en la Beta de Galactic Live. Al iniciar la app en tu PC se validará tu acceso.'}
              </p>
            </div>

            {/* Card 2: HWID Vinculado */}
            <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Hardware ID (HWID)
                </span>
                <Cpu className="h-6 w-6 text-[#00f0ff]" />
              </div>

              <div className="my-3">
                {hwid ? (
                  <div className="rounded-xl border border-white/10 bg-slate-950/90 p-3 font-mono text-xs text-[#00f0ff] break-all select-all">
                    {hwid}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-3 font-mono text-xs text-zinc-400 flex items-center justify-between">
                    <span>Sin vincular aún</span>
                    <span className="text-[10px] text-[#fbbf24] bg-[#fbbf24]/10 px-2 py-0.5 rounded">
                      En espera
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                {hwid
                  ? 'Licencia anclada a tu ordenador principal de transmisión. Máxima seguridad anti-clonación.'
                  : 'Abre Galactic Live en tu PC para completar la vinculación automática en segundos.'}
              </p>
            </div>

            {/* Card 3: Datos de Cuenta */}
            <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Canal de Streaming
                </span>
                <AtSign className="h-6 w-6 text-[#ff2a5f]" />
              </div>

              <div className="my-3">
                <p className="text-xl font-extrabold text-white">{tiktokHandle}</p>
                <p className="text-xs font-mono text-zinc-400 mt-1 truncate">{user.email}</p>
              </div>

              <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                Eventos de regalos, comentarios y batallas se conectarán a este canal en tus directos.
              </p>
            </div>
          </div>

          {/* Large Download Callout */}
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-950/95 to-[#020409] p-8 sm:p-12 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,240,255,0.15)] flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#fbbf24]/40 bg-[#fbbf24]/10 px-3 py-1 text-xs font-semibold text-[#fbbf24]">
                <Laptop className="h-3.5 w-3.5" />
                <span>Instalador Oficial Windows x64</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Descarga Galactic Live Beta para tu PC
              </h2>
              <p className="text-sm text-zinc-300">
                Ejecuta el archivo, coloca tu usuario y contraseña, y la app sincronizará tu HWID y tus
                overlays locales inmediatamente.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-zinc-400 pt-2 font-mono">
                <span>Versión: 1.0.0-Beta.1</span>
                <span>·</span>
                <span>Archivo: galactiklive.exe</span>
                <span>·</span>
                <span>Firma: GZ7 Build</span>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <a
                href="/GalacticLive-Setup.exe"
                download="GalacticLive-Setup.exe"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-[#00c8ff] to-[#ff2a5f] px-8 py-4 text-base font-bold text-black shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_45px_rgba(255,42,95,0.5)]"
              >
                <Download className="h-5 w-5 stroke-[2.5]" />
                <span>⬇ Descargar Galactic Live Beta</span>
              </a>
            </div>
          </div>

          {/* Integration & Setup Steps */}
          <div className="rounded-3xl border border-white/8 bg-slate-950/60 p-6 sm:p-8 backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-6">
              Guía Rápida de Configuración en OBS y Minecraft
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-5">
                <div className="flex items-center gap-2 mb-3 text-white font-bold text-sm">
                  <MonitorPlay className="h-4 w-4 text-[#00f0ff]" />
                  <span>1. Integrar Overlays en OBS Studio</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  Agrega una fuente de tipo <strong>Navegador (Browser Source)</strong> en OBS con la URL local generada por Galactic Live:
                </p>
                <div className="rounded-xl bg-black/60 p-3 font-mono text-xs text-[#00f0ff] border border-white/5">
                  http://localhost:3000/overlay
                </div>
                <p className="mt-2 text-[11px] text-zinc-500">
                  Resolución sugerida: 1920x1080 · FPS: 60 · Aceleración por hardware habilitada.
                </p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-5">
                <div className="flex items-center gap-2 mb-3 text-white font-bold text-sm">
                  <Gamepad2 className="h-4 w-4 text-[#fbbf24]" />
                  <span>2. Conexión RCON a Servidor de Minecraft</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  En la pestaña <em>RCON Triggers</em> de la app de escritorio, define la IP, puerto y contraseña RCON de tu servidor Minecraft:
                </p>
                <div className="rounded-xl bg-black/60 p-3 font-mono text-xs text-[#fbbf24] border border-white/5">
                  127.0.0.1:25575 (o tu IP de servidor / túnel)
                </div>
                <p className="mt-2 text-[11px] text-zinc-500">
                  Podrás asociar regalos como rosas, leones o cofres a comandos como /summon o /effect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Dashboard Footer */}
      <footer className="border-t border-white/8 py-6 text-center text-xs text-zinc-500">
        <p>
          Galactic Live Dashboard · By{' '}
          <span className="text-zinc-300 font-semibold">@bygerardguzman</span> · GZ7 Suite
        </p>
      </footer>
    </div>
  );
}
