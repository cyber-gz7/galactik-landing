import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DownloadSection from '@/components/DownloadSection';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userEmail={user?.email} />
      <main className="flex-1">
        <Hero />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}
