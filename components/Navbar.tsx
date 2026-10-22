'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, Menu, X, ShieldCheck, Sparkles, Layers, Cpu, ExternalLink } from 'lucide-react';

interface NavbarProps {
  userEmail?: string | null;
}

export default function Navbar({ userEmail }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-ultra-thin border-b border-white/[0.08] edge-light transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Apple Style Glass Identity */}
        <Link href="/" className="group flex items-center gap-3.5 transition-transform hover:scale-[1.01]">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl glass-regular border border-white/[0.12] p-0.5 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all group-hover:border-[#00f0ff]/50 group-hover:shadow-[0_0_24px_rgba(0,240,255,0.25)]">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#03050a]/80">
              <Sparkles className="h-5 w-5 text-[#00f0ff] transition-transform duration-300 group-hover:rotate-12" />
            </div>
            {/* Top-edge reflection */}
            <span className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Galactik <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ff2a85] bg-clip-text text-transparent">Live</span>
              </span>
              <span className="rounded-full bg-white/[0.06] border border-white/[0.1] px-2 py-0.5 text-[10px] font-mono font-medium text-[#00f0ff]">
                v2.1.1
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-wide text-zinc-400">
              CyberGZ7 <span className="text-zinc-600">·</span> <span className="text-[#fbbf24]">CJ7TEC</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Navigation */}
        <nav className="hidden md:flex items-center gap-1 glass-thin rounded-full px-4 py-1.5 border border-white/[0.06]">
          <a
            href="#perfiles"
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-zinc-300 transition-colors hover:text-white hover:bg-white/[0.06]"
          >
            Perfiles & Engine
          </a>
          <a
            href="#roblox-arena"
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-zinc-300 transition-colors hover:text-[#ff2a85] hover:bg-white/[0.06]"
          >
            Roblox GvG
          </a>
          <a
            href="#telemetria"
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-zinc-300 transition-colors hover:text-[#00f0ff] hover:bg-white/[0.06]"
          >
            Telemetría
          </a>
          <a
            href="#download"
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-zinc-300 transition-colors hover:text-[#fbbf24] hover:bg-white/[0.06]"
          >
            Descargar
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {userEmail ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl glass-thin border border-white/[0.1] px-4 py-2 text-[13px] font-semibold text-white hover:border-[#00f0ff]/40 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-[#00f0ff]" />
              <span>Mi Licencia</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}

          <a
            href="/api/download"
            className="apple-shine-btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#00c8ff] to-[#ff2a85] px-5 py-2.5 text-[13px] font-bold text-black shadow-[0_2px_14px_-2px_rgba(0,240,255,0.4)]"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
            <span>Descargar v2.1.1</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl glass-thin p-2 text-zinc-400 hover:text-white"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu modal */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-thick border-b border-white/[0.1] px-6 py-6 space-y-4">
          <a
            href="#perfiles"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-300 hover:text-white"
          >
            Perfiles & Engine
          </a>
          <a
            href="#roblox-arena"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-300 hover:text-[#ff2a85]"
          >
            Roblox Duelos GvG
          </a>
          <a
            href="#telemetria"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-300 hover:text-[#00f0ff]"
          >
            Telemetría en Vivo
          </a>
          <a
            href="#download"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-300 hover:text-[#fbbf24]"
          >
            Descargar Instalador v2.1.1
          </a>
          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
            <a
              href="/api/download"
              className="apple-shine-btn flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#ff2a85] py-3 text-sm font-bold text-black"
            >
              <Download className="h-4 w-4" />
              <span>Descargar v2.1.1 (54.4 MB)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
