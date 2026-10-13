import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#020409',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Galactic Live · La suite profesional de overlays para TikTok Live',
  description:
    'Eleva la calidad de tus transmisiones en TikTok Live con overlays reactivos en tiempo real, integración RCON Minecraft y sincronización instantánea para OBS Studio. Creado por @bygerardguzman.',
  keywords: [
    'Galactic Live',
    'TikTok Live',
    'OBS Studio Overlays',
    'Minecraft RCON',
    'Streamer Overlays',
    'GZ7',
    'TikTok Stream',
  ],
  authors: [{ name: 'Gerard Guzman (GZ7)', url: 'https://github.com/bygerardguzman' }],
  openGraph: {
    title: 'Galactic Live · Overlays profesionales para TikTok Live',
    description:
      'Interactividad en vivo, animaciones 60 FPS, control RCON para Minecraft y widgets OBS en tiempo real.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Galactic Live',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var i = 0; i < registrations.length; i++) {
                    registrations[i].unregister();
                  }
                });
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (var i = 0; i < names.length; i++) {
                      caches.delete(names[i]);
                    }
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#020409] text-[#f8fafc] font-sans antialiased selection:bg-[#00f0ff]/30 selection:text-white relative">
        <div className="cosmic-bg pointer-events-none" aria-hidden="true" />
        <div className="cosmic-glow-1 pointer-events-none" aria-hidden="true" />
        <div className="cosmic-glow-2 pointer-events-none" aria-hidden="true" />
        <div className="cosmic-glow-3 pointer-events-none" aria-hidden="true" />
        <div className="relative flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
