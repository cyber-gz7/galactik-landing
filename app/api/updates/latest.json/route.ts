import { NextResponse } from 'next/server';

export async function GET() {
  const updateManifest = {
    version: '2.1.2',
    notes: 'Actualización v2.1.2: Panel de Control de Cuentas & Licencias para Streamers con aprobación en 1 clic desde Supabase, sincronización inmediata de solicitudes pendientes, visualización directa en sidebar y topbar, y blindaje de navegación.',
    pub_date: new Date().toISOString(),
    platforms: {
      'windows-x86_64': {
        signature: '',
        url: 'https://github.com/cyber-gz7/galactik-landing/releases/download/v2.1.2/Galactik.Live_2.1.2_x64-setup.exe',
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
