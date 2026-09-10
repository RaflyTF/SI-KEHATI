import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createProgramPhoto } from '@/services/programPhoto.service';
import { programPhotoInputSchema } from '@/lib/validators/programPhoto.validator';
import { ZodError } from 'zod';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;

  if (!actorId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = programPhotoInputSchema.parse(body);
    const photo = await createProgramPhoto(params.id, parsed, actorId);
    return NextResponse.json({ success: true, data: photo }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : 'Gagal menambah foto.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}