import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/8 bg-[#020409]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00f0ff]/30 to-[#ff2a5f]/30 border border-[#00f0ff]/40 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#020409]">
                <Sparkles className="h-4 w-4 text-[#00f0ff]" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold text-white">
                Galactic{' '}
                <span className="bg-gradient-to-r from-[#00f0ff] to-[#ff2a5f] bg-clip-text text-transparent">
                  Live
                </span>
              </span>
              <p className="text-xs text-zinc-400">
                Overlays y Automatización para Creadores de TikTok Live
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            <a href="#features" className="hover:text-[#00f0ff] transition-colors">
              Módulos
            </a>
            <a href="#requirements" className="hover:text-[#00f0ff] transition-colors">
              Requisitos
            </a>
            <a href="#download" className="hover:text-[#ff2a5f] transition-colors">
              Descargar
            </a>
            <Link href="/auth/login" className="hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/dashboard" className="hover:text-[#fbbf24] transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Copyright & Author */}
          <div className="flex flex-col md:items-end text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span>Desarrollado con</span>
              <Heart className="h-3.5 w-3.5 text-[#ff2a5f] fill-[#ff2a5f]" />
              <span>por</span>
              <a
                href="https://github.com/bygerardguzman"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white hover:text-[#00f0ff] transition-colors"
              >
                @bygerardguzman
              </a>
              <span className="text-[#fbbf24] font-semibold">· GZ7</span>
            </div>
            <p className="mt-1 text-zinc-500">
              © {currentYear} Galactic Live Suite. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
