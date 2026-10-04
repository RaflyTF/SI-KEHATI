import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateProgramSpeciesData, deleteProgramSpeciesData } from '@/services/programSpeciesData.service';
import { programSpeciesDataUpdateSchema } from '@/lib/validators/programSpeciesData.validator';
import { ZodError } from 'zod';

export async function PUT(req: NextRequest, { params }: { params: { dataId: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;

  if (!actorId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { jumlahIndividu } = programSpeciesDataUpdateSchema.parse(body);
    const data = await updateProgramSpeciesData(params.dataId, jumlahIndividu, actorId);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : 'Gagal memperbarui data pendukung.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { dataId: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;

  if (!actorId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    await deleteProgramSpeciesData(params.dataId, actorId);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus data pendukung.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}