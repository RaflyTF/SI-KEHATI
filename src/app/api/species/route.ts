import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Master data spesies -- dibaca oleh publik (untuk label grafik) maupun internal (form input).
export async function GET() {
  const data = await prisma.species.findMany({ orderBy: { namaLokal: 'asc' } });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }
  const body = await req.json();
  const species = await prisma.species.create({ data: body });
  return NextResponse.json({ success: true, data: species }, { status: 201 });
}
