import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSpeciesRecordById, updateSpeciesRecord, deleteSpeciesRecord } from '@/services/speciesRecord.service';
import { speciesRecordUpdateSchema } from '@/lib/validators/speciesRecord.validator';
import { ZodError } from 'zod';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  const record = await getSpeciesRecordById(params.id);
  if (!record) {
    return NextResponse.json({ success: false, message: 'Data tidak ditemukan.' }, { status: 404 });
  }

  // Petugas Lapangan hanya boleh melihat detail data miliknya sendiri.
  if (role === 'petugas_lapangan' && record.inputBy !== userId) {
    return NextResponse.json({ success: false, message: 'Anda tidak memiliki akses ke data ini.' }, { status: 403 });
  }

  return NextResponse.json({ success: true, data: record });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId || (role !== 'petugas_lapangan' && role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = speciesRecordUpdateSchema.parse(body);
    const record = await updateSpeciesRecord(params.id, parsed, userId, role as string);
    return NextResponse.json({ success: true, data: record });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : 'Gagal memperbarui data.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  // Admin SENGAJA tidak disertakan di sini -- hak hapus data monitoring
  // dibatasi untuk Petugas Lapangan (milik sendiri) dan Super Admin saja.
  if (!userId || (role !== 'petugas_lapangan' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    await deleteSpeciesRecord(params.id, userId, role as string);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus data.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}