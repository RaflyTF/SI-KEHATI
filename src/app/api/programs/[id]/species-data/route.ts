import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createProgramSpeciesData } from '@/services/programSpeciesData.service';
import { programSpeciesDataInputSchema } from '@/lib/validators/programSpeciesData.validator';
import { ZodError } from 'zod';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;

  // Sesuai requirement #14: hanya Admin & Super Admin, Petugas Lapangan
  // TIDAK diberi akses manajemen data pendukung program.
  if (!actorId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = programSpeciesDataInputSchema.parse(body);
    const data = await createProgramSpeciesData(params.id, parsed, actorId);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : 'Gagal menyimpan data pendukung.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}