import { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import type { NavTabId } from './components/layout/SidebarLeft';
import { HomeWorkspace } from './features/home/HomeWorkspace';
import { RobloxWorkspace } from './features/roblox-gvg/RobloxWorkspace';
import { MinecraftWorkspace } from './features/minecraft-studio/MinecraftWorkspace';
import { GiftCatalogWorkspace } from './features/gift-catalog/GiftCatalogWorkspace';
import { AdminLicensesWorkspace } from './features/admin-licenses/AdminLicensesWorkspace';
import { AlertsChromaWorkspace } from './features/alerts-chroma/AlertsChromaWorkspace';
import { TopsGoalsWorkspace } from './features/tops-goals/TopsGoalsWorkspace';
import { SoundsMemesWorkspace } from './features/sounds-memes/SoundsMemesWorkspace';
import { GiftSelectorModal } from './features/gift-catalog/components/GiftSelectorModal';
import { UpdateModal } from './features/auto-updater/components/UpdateModal';
import { useAppConfigStore } from './stores/useAppConfigStore';
import { useAutoUpdaterStore } from './features/auto-updater/stores/useAutoUpdaterStore';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('home');
  const initAppState = useAppConfigStore((s) => s.initAppState);
  const checkForUpdates = useAutoUpdaterStore((s) => s.checkForUpdates);

  useEffect(() => {
    initAppState();
    checkForUpdates(false);
  }, [initAppState, checkForUpdates]);

  return (
    <>
      <AppLayout activeTab={activeTab} onSelectTab={setActiveTab}>
        {activeTab === 'home' && <HomeWorkspace onNavigateTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'roblox' && <RobloxWorkspace />}
        {activeTab === 'minecraft' && <MinecraftWorkspace />}
        {activeTab === 'catalog' && <GiftCatalogWorkspace />}
        {activeTab === 'admin' && <AdminLicensesWorkspace />}
        {activeTab === 'alerts' && <AlertsChromaWorkspace />}
        {activeTab === 'tops' && <TopsGoalsWorkspace />}
        {activeTab === 'sounds' && <SoundsMemesWorkspace />}
      </AppLayout>

      {/* Modales Globales */}
      <GiftSelectorModal />
      <UpdateModal />
    </>
  );
}
