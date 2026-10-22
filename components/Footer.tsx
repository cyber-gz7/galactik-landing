import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Github, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.08] glass-ultra-thin">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl glass-regular border border-white/[0.12] p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-[12px] bg-[#03050a]">
                <Sparkles className="h-4 w-4 text-[#00f0ff]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">
                  Galactik <span className="bg-gradient-to-r from-[#00f0ff] to-[#ff2a85] bg-clip-text text-transparent">Live</span>
                </span>
                <span className="rounded-full bg-white/[0.06] border border-white/[0.1] px-2 py-0.2 text-[10px] font-mono text-[#00f0ff]">
                  v2.1.1
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Suite Profesional de Overlays y Automatización para TikTok Live
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            <a href="#perfiles" className="hover:text-white transition-colors">
              Perfiles
            </a>
            <a href="#roblox-arena" className="hover:text-[#ff2a85] transition-colors">
              Roblox Arena
            </a>
            <a href="#telemetria" className="hover:text-[#00f0ff] transition-colors">
              Telemetría
            </a>
            <a href="#download" className="hover:text-[#fbbf24] transition-colors">
              Descargar
            </a>
            <Link href="/auth/login" className="hover:text-white transition-colors">
              Mi Licencia
            </Link>
          </div>

          {/* Copyright & Author */}
          <div className="flex flex-col md:items-end text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span>Desarrollado por</span>
              <a
                href="https://github.com/bygerardguzman"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white hover:text-[#00f0ff] transition-colors"
              >
                CyberGZ7
              </a>
              <span className="text-[#fbbf24] font-semibold">· CJ7TEC</span>
            </div>
            <p className="mt-1 text-zinc-500 text-[11px]">
              © {currentYear} Galactik Live. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
