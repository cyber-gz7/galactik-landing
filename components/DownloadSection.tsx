'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Download,
  ShieldCheck,
  Cpu,
  Laptop,
  CheckCircle2,
  FileCode2,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function DownloadSection() {
  const [copied, setCopied] = useState(false);
  const sha256 = '79cc452b0c097df8cb573511c09de350fb09b38288ed2eb8e6934e135a7977ea';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="download" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Glass Pod Container */}
        <div className="relative mx-auto max-w-5xl rounded-3xl glass-thick border border-white/[0.12] p-8 sm:p-14 edge-light shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8),0_0_60px_-10px_rgba(0,240,255,0.18)]">
          <div className="text-center max-w-3xl mx-auto">
            {/* Version & Arch Badge */}
            <div className="inline-flex items-center gap-2 rounded-full glass-thin border border-[#fbbf24]/30 px-4 py-1.5 text-xs font-semibold text-[#fbbf24] shadow-[0_2px_12px_rgba(251,191,36,0.15)] mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Versión 2.1.3 Oficial · Windows 10/11 x64 · 54.8 MB</span>
            </div>

            <h2 className="apple-headline text-3xl sm:text-5xl font-extrabold text-white">
              Descarga{' '}
              <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ff2a85] bg-clip-text text-transparent">
                Galactik Live
              </span>{' '}
              para Windows
            </h2>

            <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Instalador empaquetado y firmado digitalmente como propiedad intelectual de CyberGZ7.
              Incluye runtime autónomo de Node.js, plugins de Minecraft y arena Roblox listos para usar sin configuraciones complejas.
            </p>

            {/* Huge Apple-Grade Download Button */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/api/download"
                className="apple-shine-btn group inline-flex w-full sm:w-auto items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-[#00c8ff] to-[#ff2a85] px-10 py-5 text-lg font-bold text-black shadow-[0_4px_30px_rgba(0,240,255,0.45)] hover:shadow-[0_8px_45px_rgba(255,42,133,0.55)]"
              >
                <Download className="h-6 w-6 stroke-[2.5] transition-transform group-hover:translate-y-0.5" />
                <div className="flex flex-col text-left">
                  <span className="leading-tight">Descargar Galactik Live v2.1.3</span>
                  <span className="text-xs font-medium text-black/75">
                    Galactik Live_2.1.3_x64-setup.exe · ~54.8 MB
                  </span>
                </div>
              </a>

              <a
                href="https://github.com/cyber-gz7/galactik-landing/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl glass-regular border border-white/[0.12] px-7 py-5 text-base font-semibold text-white hover:border-[#00f0ff]/40 hover:bg-white/[0.08] transition-all"
              >
                <span>GitHub Releases</span>
                <ExternalLink className="h-4 w-4 text-[#00f0ff]" />
              </a>
            </div>

            {/* Cryptographic Verification Box (Apple Clean Security) */}
            <div className="mt-8 rounded-2xl glass-thin border border-white/[0.06] p-4 max-w-2xl mx-auto text-left">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="font-semibold text-white">Checksum SHA-256 Verificado</span>
                </div>
                <button
                  onClick={handleCopyHash}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#00f0ff] hover:text-white transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Hash'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-zinc-400 break-all bg-black/40 px-3 py-1.5 rounded-lg border border-white/[0.04]">
                {sha256}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Firma Authenticode: <strong>CyberGZ7 (CJ7TEC)</strong></span>
                <span>Almacén: Cert:\CurrentUser\My</span>
              </div>
            </div>
          </div>

          {/* System Requirements Grid */}
          <div id="requirements" className="mt-14 pt-12 border-t border-white/[0.08]">
            <h3 className="text-center text-xs font-bold uppercase tracking-widest text-[#00f0ff] mb-8 font-mono">
              Requisitos del Sistema & Compatibilidad de Hardware
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl glass-thin border border-white/[0.06] p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Laptop className="h-5 w-5 text-[#00f0ff]" />
                  <span className="text-sm font-bold text-white">Sistema Operativo</span>
                </div>
                <p className="text-xs text-zinc-300">Windows 10 / 11 (64-bit)</p>
                <p className="text-[11px] text-zinc-500 mt-1">Soporte nativo DirectX / WebGPU</p>
              </div>

              <div className="rounded-2xl glass-thin border border-white/[0.06] p-5">
                <div className="flex items-center gap-3 mb-2">
                  <FileCode2 className="h-5 w-5 text-[#ff2a85]" />
                  <span className="text-sm font-bold text-white">Streaming Softwares</span>
                </div>
                <p className="text-xs text-zinc-300">OBS Studio 29+, TikTok Live Studio</p>
                <p className="text-[11px] text-zinc-500 mt-1">Fuente Browser Source con aceleración</p>
              </div>

              <div className="rounded-2xl glass-thin border border-white/[0.06] p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="h-5 w-5 text-[#fbbf24]" />
                  <span className="text-sm font-bold text-white">Rendimiento Base</span>
                </div>
                <p className="text-xs text-zinc-300">4 GB RAM (App requiere &lt;80 MB)</p>
                <p className="text-[11px] text-zinc-500 mt-1">Optimizado para single & dual channel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
