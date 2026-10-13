import Link from 'next/link';
import {
  Download,
  ShieldCheck,
  Cpu,
  Laptop,
  CheckCircle2,
  FileCode2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function DownloadSection() {
  return (
    <section id="download" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Glow behind download box */}
        <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#020409] p-8 sm:p-14 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,240,255,0.12)]">
          <div className="text-center max-w-3xl mx-auto">
            {/* Version Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#fbbf24]/40 bg-[#fbbf24]/10 px-4 py-1.5 text-xs font-semibold text-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.15)] mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Versión 1.0.0-Beta.1 · Windows x64</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Lleva tus directos al siguiente nivel con{' '}
              <span className="bg-gradient-to-r from-[#00f0ff] to-[#ff2a5f] bg-clip-text text-transparent">
                Galactic Live
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
              Descarga directa del instalador de escritorio comercial. Instalación limpia sin
              bloatware y con vinculación automática de HWID al iniciar sesión.
            </p>

            {/* Huge Download Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/GalacticLive-Setup.exe"
                download="GalacticLive-Setup.exe"
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-[#00c8ff] to-[#ff2a5f] px-10 py-5 text-lg font-bold text-black shadow-[0_0_35px_rgba(0,240,255,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_55px_rgba(255,42,95,0.55)]"
              >
                <Download className="h-6 w-6 stroke-[2.5] transition-transform group-hover:translate-y-0.5" />
                <div className="flex flex-col text-left">
                  <span className="leading-tight">⬇ Descargar Galactic Live Beta</span>
                  <span className="text-xs font-medium text-slate-900/80">
                    GalacticLive-Setup.exe · ~21 MB (Windows 10/11)
                  </span>
                </div>
              </a>

              <Link
                href="/dashboard"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-5 text-base font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-[#00f0ff]/50 hover:bg-white/10 hover:text-[#00f0ff]"
              >
                <ShieldCheck className="h-5 w-5 text-[#00f0ff]" />
                <span>Ver Mi Licencia</span>
              </Link>
            </div>

            <p className="mt-4 text-xs text-zinc-500 font-mono">
              Firma digital de compilación GZ7 · Hash SHA-256 verificado · Actualizaciones OTA
            </p>
          </div>

          {/* System Requirements Grid */}
          <div id="requirements" className="mt-14 pt-12 border-t border-white/10">
            <h3 className="text-center text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00f0ff] mb-8">
              Requisitos del Sistema y Compatibilidad
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                  <Laptop className="h-5 w-5 text-[#00f0ff]" />
                  <span className="text-sm font-bold text-white">Sistema Operativo</span>
                </div>
                <p className="text-xs text-zinc-300">Windows 10 / 11 (64-bit)</p>
                <p className="text-[11px] text-zinc-500 mt-1">Arquitectura x64 compatible</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                  <FileCode2 className="h-5 w-5 text-[#ff2a5f]" />
                  <span className="text-sm font-bold text-white">Entorno Node.js</span>
                </div>
                <p className="text-xs text-zinc-300">Node.js 18.x o superior</p>
                <p className="text-[11px] text-zinc-500 mt-1">Para scripts y extensiones custom</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="h-5 w-5 text-[#fbbf24]" />
                  <span className="text-sm font-bold text-white">Software Streaming</span>
                </div>
                <p className="text-xs text-zinc-300">OBS Studio 29.0+ o Streamlabs</p>
                <p className="text-[11px] text-zinc-500 mt-1">Navegador Browser Source activo</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Hardware ID (HWID)</span>
                </div>
                <p className="text-xs text-zinc-300">Vínculo con 1 equipo</p>
                <p className="text-[11px] text-zinc-500 mt-1">Activación automática al iniciar</p>
              </div>
            </div>
          </div>

          {/* Quick 3-Step Setup Guide */}
          <div className="mt-10 rounded-2xl border border-white/8 bg-black/40 p-6">
            <h4 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#00f0ff]" />
              ¿Cómo empezar en menos de 2 minutos?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00f0ff]/20 font-bold text-[#00f0ff]">
                  1
                </span>
                <div>
                  <strong className="text-white block mb-0.5">Crea tu cuenta de Streamer</strong>
                  Regístrate con tu email y tu usuario @handle de TikTok.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff2a5f]/20 font-bold text-[#ff2a5f]">
                  2
                </span>
                <div>
                  <strong className="text-white block mb-0.5">Ejecuta Galactic Live</strong>
                  Abre `galactiklive.exe`. Tu HWID se asociará automáticamente a tu licencia.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fbbf24]/20 font-bold text-[#fbbf24]">
                  3
                </span>
                <div>
                  <strong className="text-white block mb-0.5">Copia tu Browser Source a OBS</strong>
                  Pega el enlace en OBS Studio, inicia tu directo y disfruta las alertas en vivo.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
