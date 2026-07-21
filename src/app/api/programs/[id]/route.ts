import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getProgramById, updateProgram, deleteProgram } from '@/services/program.service';
import { programUpdateSchema } from '@/lib/validators/program.validator';
import { ZodError } from 'zod';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const program = await getProgramById(params.id);
  if (!program) return NextResponse.json({ success: false, message: 'Program tidak ditemukan.' }, { status: 404 });
  return NextResponse.json({ success: true, data: program });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const parsed = programUpdateSchema.parse(body);
    const program = await updateProgram(params.id, parsed, userId);
    return NextResponse.json({ success: true, data: program });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal memperbarui program.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }
  await deleteProgram(params.id, userId);
  return NextResponse.json({ success: true });
}
