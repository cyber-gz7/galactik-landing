import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getSetupPath() {
  const primary = path.join(process.cwd(), 'public', 'Galactik Live_2.1.1_x64-setup.exe');
  if (fs.existsSync(primary)) return primary;
  const fallback = path.join(process.cwd(), 'public', 'GalacticLive-Setup.exe');
  if (fs.existsSync(fallback)) return fallback;
  return null;
}

export async function GET() {
  const filePath = getSetupPath();

  if (!filePath) {
    return new NextResponse('Installer file not found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const nodeStream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
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

export async function HEAD() {
  const filePath = getSetupPath();

  if (!filePath) {
    return new NextResponse(null, { status: 404 });
  }

  const stat = fs.statSync(filePath);

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
