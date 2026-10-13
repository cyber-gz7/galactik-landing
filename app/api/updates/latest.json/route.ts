import { NextResponse } from 'next/server';

export async function GET() {
  const updateManifest = {
    version: '2.0.0',
    notes: 'Lanzamiento oficial de Galactic Live Suite Beta',
    pub_date: '2026-10-13T10:00:00Z',
    platforms: {
      'windows-x86_64': {
        signature: '',
        url: 'https://github.com/cyber-gz7/galactik-landing/releases/latest/download/GalacticLive-Setup.exe',
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
