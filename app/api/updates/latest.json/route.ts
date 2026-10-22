import { NextResponse } from 'next/server';

export async function GET() {
  const updateManifest = {
    version: '2.1.3',
    notes: 'Actualización v2.1.3: Motor de reconocimiento bilingüe de regalos (Español/Inglés) con ID numérico universal de TikTok, buscador bilingüe en catálogo de 1,770 regalos, subtítulos en español y persistencia de tiktokGiftId.',
    pub_date: new Date().toISOString(),
    platforms: {
      'windows-x86_64': {
        signature: '',
        url: 'https://github.com/cyber-gz7/galactik-landing/releases/download/v2.1.3/Galactik.Live_2.1.3_x64-setup.exe',
      },
    },
  };

  return NextResponse.json(updateManifest, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
