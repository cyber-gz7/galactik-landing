import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#03050a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Galactik Live v2.1.1 · Pro Broadcast Suite para TikTok Live',
  description:
    'La suite profesional de overlays reactivos en tiempo real, integración RCON Minecraft, arenas Roblox Duelos GvG y sincronización instantánea para OBS Studio. Desarrollado por CyberGZ7 · CJ7TEC.',
  keywords: [
    'Galactik Live',
    'Galactik Live 2.1.1',
    'TikTok Live Overlays',
    'Minecraft RCON Streamer',
    'Roblox Duelos GvG',
    'OBS Studio 60fps',
    'CyberGZ7',
    'CJ7TEC',
  ],
  authors: [{ name: 'CyberGZ7 (CJ7TEC)', url: 'https://github.com/bygerardguzman' }],
  openGraph: {
    title: 'Galactik Live v2.1.1 · Suite Definitiva para Streamers de TikTok Live',
    description:
      'Overlays de OBS en 60 FPS acelerados por GPU, Duelos Roblox GvG, sincronización RCON Minecraft y telemetría en tiempo real.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Galactik Live',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} dark scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-[#03050a] text-white/95 font-sans antialiased selection:bg-[#00f0ff]/30 selection:text-white relative overflow-x-hidden">
        {/* Apple-Caliber Ambient Light Canvas */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.08)_0%,rgba(0,240,255,0)_70%)] blur-[80px]" />
          <div className="absolute top-[35%] -left-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,42,133,0.06)_0%,rgba(255,42,133,0)_70%)] blur-[100px]" />
          <div className="absolute top-[65%] -right-[10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(0,240,255,0.05)_0%,rgba(0,240,255,0)_70%)] blur-[110px]" />
          <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20px_20px,rgba(255,255,255,0.04),transparent)] bg-[size:32px_32px]" />
        </div>
        <div className="relative flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
