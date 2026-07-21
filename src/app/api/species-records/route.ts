import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPublishedSpeciesRecords, getPendingSpeciesRecords, submitSpeciesRecord } from '@/services/speciesRecord.service';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status');
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  // Data "pending" hanya boleh diambil oleh Admin/Super Admin yang sudah login.
  // Selain itu (termasuk tanpa parameter status sama sekali), yang dikembalikan
  // SELALU data published -- tidak bergantung pada input query dari client.
  if (status === 'pending') {
    if (!role || (role !== 'admin' && role !== 'super_admin')) {
      return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
    }
    const data = await getPendingSpeciesRecords();
    return NextResponse.json({ success: true, data });
  }

  const data = await getPublishedSpeciesRecords();
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string; id?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!session || !userId || (role !== 'petugas_lapangan' && role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const record = await submitSpeciesRecord(body, userId);
    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menyimpan data.' }, { status: 500 });
  }
}
