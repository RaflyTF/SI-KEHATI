import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteProgramPhoto } from '@/services/programPhoto.service';

export async function DELETE(_req: Request, { params }: { params: { photoId: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;

  if (!actorId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    await deleteProgramPhoto(params.photoId, actorId);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus foto.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}