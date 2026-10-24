import React from 'react';
import { SidebarLeft, type NavTabId } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';

interface AppLayoutProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  onSelectTab,
  children
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#040812] text-[#F2F7FF] select-none">
      {/* 1. Sidebar Izquierda Fija (~250px) */}
      <SidebarLeft activeTab={activeTab} onSelectTab={onSelectTab} />

      {/* 2. Área Central Scrollable (El contenido de la vista activa) */}
      <main className="flex-1 overflow-y-auto p-6 [scrollbar-width:thin] [scrollbar-color:#091322_transparent]">
        {children}
      </main>

      {/* 3. Columna Derecha Fija (~320px) con Motor TikTok, Estado y Novedades */}
      <SidebarRight />
    </div>
  );
};
