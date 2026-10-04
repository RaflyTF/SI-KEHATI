import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { activateUser } from '@/services/user.service';

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;
  if (!actorId || role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const user = await activateUser(params.id, actorId);
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal mengaktifkan kembali akun.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}