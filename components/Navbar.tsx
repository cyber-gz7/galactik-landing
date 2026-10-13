'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Download, Menu, X, Terminal, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  userEmail?: string | null;
}

export default function Navbar({ userEmail }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#020409]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00f0ff]/20 via-[#ff2a5f]/20 to-transparent p-0.5 border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-transform duration-300 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#020409]">
              <Sparkles className="h-5 w-5 text-[#00f0ff] transition-colors group-hover:text-[#ff2a5f]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-white">Galactic</span>{' '}
              <span className="bg-gradient-to-r from-[#00f0ff] to-[#ff2a5f] bg-clip-text text-transparent">
                Live
              </span>
            </span>
            <span className="text-[11px] font-medium tracking-wide text-zinc-400">
              By @bygerardguzman <span className="text-[#fbbf24]">· GZ7</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-[#00f0ff]"
          >
            Módulos y Engine
          </a>
          <a
            href="#requirements"
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-[#00f0ff]"
          >
            Requisitos
          </a>
          <a
            href="#download"
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-[#ff2a5f]"
          >
            Descargar Beta
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {userEmail ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-4 py-2 text-sm font-semibold text-[#00f0ff] transition-all duration-300 hover:bg-[#00f0ff]/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <ShieldCheck className="h-4 w-4" />
              Panel Streamer
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#ff2a5f] px-4 py-2 text-sm font-semibold text-black transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_20px_rgba(255,42,95,0.4)]"
              >
                <Terminal className="h-4 w-4 text-black" />
                Registrarse
              </Link>
            </>
          )}

          <a
            href="/GalacticLive-Setup.exe"
            download="GalacticLive-Setup.exe"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-200 transition-all hover:border-[#fbbf24]/50 hover:bg-[#fbbf24]/10 hover:text-[#fbbf24]"
            title="Descarga directa GalacticLive-Setup.exe"
          >
            <Download className="h-4 w-4" />
            <span className="hidden lg:inline">v1.0 Beta</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#020409]/95 px-4 pt-2 pb-6 backdrop-blur-2xl">
          <div className="flex flex-col space-y-4">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-zinc-300 hover:text-[#00f0ff]"
            >
              Módulos y Engine
            </a>
            <a
              href="#requirements"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-zinc-300 hover:text-[#00f0ff]"
            >
              Requisitos del Sistema
            </a>
            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#00f0ff] hover:underline"
            >
              Descargar Galactic Live Beta
            </a>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              {userEmail ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#00f0ff]/20 border border-[#00f0ff]/50 py-3 text-sm font-bold text-[#00f0ff]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Ir al Panel Streamer
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#ff2a5f] py-3 text-sm font-bold text-black"
                  >
                    <Terminal className="h-4 w-4 text-black" />
                    Registrarse Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
