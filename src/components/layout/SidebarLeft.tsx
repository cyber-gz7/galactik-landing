import React from 'react';
import {
  LayoutGrid,
  Radio,
  Sliders,
  Sparkles,
  Volume2,
  Tv,
  Trophy,
  Gamepad2,
  Globe2,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export type NavTabId =
  | 'home'
  | 'roblox'
  | 'minecraft'
  | 'catalog'
  | 'admin'
  | 'sounds'
  | 'alerts'
  | 'tops';

interface SidebarLeftProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({ activeTab, onSelectTab }) => {
  const mainNav = [
    { id: 'home' as NavTabId, label: 'Inicio', icon: LayoutGrid },
    { id: 'roblox' as NavTabId, label: 'Transmitir (Roblox)', icon: Radio },
    { id: 'minecraft' as NavTabId, label: 'Minecraft Studio', icon: Sliders },
    { id: 'catalog' as NavTabId, label: 'Plantillas / 1,770 Regalos', icon: Sparkles },
    { id: 'sounds' as NavTabId, label: 'Sonidos & Memes', icon: Volume2 },
    { id: 'alerts' as NavTabId, label: 'Alertas & Croma', icon: Tv },
    { id: 'tops' as NavTabId, label: 'Tops & Metas', icon: Trophy }
  ];

  const profiles = [
    { id: 'minecraft' as NavTabId, label: 'Minecraft', subtitle: 'Overlays & Plugins', icon: Radio, color: 'text-[#00FFA3]' },
    { id: 'roblox' as NavTabId, label: 'Roblox (Obby)', subtitle: 'Duelo Gift vs Gift', icon: Gamepad2, color: 'text-[#00F0FF]' },
    { id: 'tops' as NavTabId, label: 'Universal / IRL', subtitle: 'Tops, Metas & Ranking', icon: Globe2, color: 'text-[#8B5CFF]' }
  ];

  return (
    <aside className="w-[250px] shrink-0 border-r border-[rgba(0,240,255,0.15)] bg-[#070E1A] flex flex-col justify-between h-full select-none z-20">
      {/* 1. Header con Logo Oficial y Brillo */}
      <div>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[rgba(0,240,255,0.12)]">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00F0FF] via-[#0077FF] to-[#8B5CFF] p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#040812]">
              {/* Logo Galáctico con Anillo SVG */}
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <defs>
                  <linearGradient id="sbLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#00F0FF" />
                    <stop offset="100%" stopColor="#0077FF" />
                  </linearGradient>
                  <linearGradient id="sbRingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF2A85" />
                    <stop offset="100%" stopColor="#00F0FF" />
                  </linearGradient>
                </defs>
                <ellipse cx="16" cy="16" rx="13" ry="5.5" transform="rotate(-30 16 16)" stroke="url(#sbRingGrad)" strokeWidth="1.8" fill="none" />
                <path d="M16 4 L19.5 12.5 L28 16 L19.5 19.5 L16 28 L12.5 19.5 L4 16 L12.5 12.5 Z" fill="url(#sbLogoGrad)" />
                <circle cx="16" cy="16" r="3" fill="#FFFFFF" />
              </svg>
            </div>
          </div>
          <div>
            <div className="font-display font-black text-sm tracking-wider text-white [text-shadow:0_0_10px_rgba(0,240,255,0.4)]">
              GALACTK PANEL
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#94A3B8] uppercase">
              <span>By GZ7</span>
              <span>&bull;</span>
              <span className="font-black text-[#FFE600]">PRO SUITE</span>
            </div>
          </div>
        </div>

        {/* 2. Navegación Principal */}
        <div className="px-3 py-4">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold tracking-widest text-[#64748B] uppercase">
            HERRAMIENTAS
          </div>
          <nav className="flex flex-col gap-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00F0FF]/20 to-[#0077FF]/10 text-[#00F0FF] border border-[#00F0FF]/50 shadow-[0_0_16px_rgba(0,240,255,0.25)]'
                      : 'text-[#94A3B8] hover:bg-[#0D1B2A] hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[#00F0FF]' : 'text-[#64748B] group-hover:text-white'}`} />
                  <span className="truncate flex-1">{item.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 3. Sección "PERFILES" */}
        <div className="px-3 pt-2">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold tracking-widest text-[#64748B] uppercase">
            PERFILES DE JUEGO
          </div>
          <div className="flex flex-col gap-1.5">
            {profiles.map((p) => {
              const Icon = p.icon;
              const isSelected = activeTab === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectTab(p.id)}
                  className={`flex items-center justify-between rounded-xl p-2.5 text-left transition-all ${
                    isSelected
                      ? 'bg-[#091322] border border-[#00F0FF]/40 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                      : 'bg-[#050A14]/60 border border-[rgba(0,240,255,0.08)] hover:border-[rgba(0,240,255,0.25)] hover:bg-[#091322]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-black/40 border border-white/5 ${p.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white leading-tight">{p.label}</div>
                      <div className="text-[10px] text-[#64748B]">{p.subtitle}</div>
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00F0FF] text-[10px] font-black text-black shadow-[0_0_8px_#00F0FF]">
                      ✓
                    </span>
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-[#64748B]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Footer con Configuración y Licencias */}
      <div className="p-3 border-t border-[rgba(0,240,255,0.12)] bg-[#050A14]/80 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onSelectTab('admin')}
          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
            activeTab === 'admin'
              ? 'bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/50'
              : 'text-[#94A3B8] hover:bg-[#0D1B2A] hover:text-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-[#FFE600]" />
          <span>Licencias &amp; HWID</span>
        </button>

        <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-mono text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <Settings className="h-3 w-3" />
            <span>v2.2.2 PRO</span>
          </div>
          <span className="text-[#00FFA3] font-bold">ONLINE</span>
        </div>
      </div>
    </aside>
  );
};
