'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { LogOut, Loader2 } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs sm:text-sm font-semibold text-red-300 transition-all hover:bg-red-500/20 hover:border-red-500/60 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-red-400" />
          <span>Cerrando sesión...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 text-red-400" />
          <span>Cerrar Sesión</span>
        </>
      )}
    </button>
  );
}
