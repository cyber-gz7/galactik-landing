import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getSetupPath() {
  const v212 = path.join(process.cwd(), 'public', 'Galactik Live_2.1.2_x64-setup.exe');
  if (fs.existsSync(v212)) return { path: v212, name: 'Galactik Live_2.1.2_x64-setup.exe' };
  const v211 = path.join(process.cwd(), 'public', 'Galactik Live_2.1.1_x64-setup.exe');
  if (fs.existsSync(v211)) return { path: v211, name: 'Galactik Live_2.1.1_x64-setup.exe' };
  const fallback = path.join(process.cwd(), 'public', 'GalacticLive-Setup.exe');
  if (fs.existsSync(fallback)) return { path: fallback, name: 'Galactik Live_2.1.2_x64-setup.exe' };
  return null;
}

export async function GET() {
  const fileInfo = getSetupPath();

  if (!fileInfo) {
    return new NextResponse('Installer file not found', { status: 404 });
  }

  const stat = fs.statSync(fileInfo.path);
  const nodeStream = fs.createReadStream(fileInfo.path);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileInfo.name}"`,
      'Content-Length': stat.size.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

export async function HEAD() {
  const fileInfo = getSetupPath();

  if (!fileInfo) {
    return new NextResponse(null, { status: 404 });
  }

  const stat = fs.statSync(fileInfo.path);

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="Galactik Live_2.1.1_x64-setup.exe"',
      'Content-Length': stat.size.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
