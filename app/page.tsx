import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DownloadSection from '@/components/DownloadSection';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = cookies();
  const hasAuthCookie = cookieStore.getAll().some((c) => c.name.includes('auth-token') || c.name.includes('sb-'));

  let userEmail: string | null = null;
  if (hasAuthCookie) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userEmail = user?.email || null;
    } catch {
      userEmail = null;
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userEmail={userEmail} />
      <main className="flex-1">
        <Hero />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}
