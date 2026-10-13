import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'GalacticLive-Setup.exe');

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const nodeStream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="GalacticLive-Setup.exe"',
      'Content-Length': stat.size.toString(),
      'Cache-Control': 'public, max-age=3600, immutable',
    },
  });
}

export async function HEAD() {
  const filePath = path.join(process.cwd(), 'public', 'GalacticLive-Setup.exe');

  if (!fs.existsSync(filePath)) {
    return new NextResponse(null, { status: 404 });
  }

  const stat = fs.statSync(filePath);

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="GalacticLive-Setup.exe"',
      'Content-Length': stat.size.toString(),
      'Cache-Control': 'public, max-age=3600, immutable',
    },
  });
}
