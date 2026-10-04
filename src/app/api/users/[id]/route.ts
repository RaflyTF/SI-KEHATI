import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserWithRelatedCounts, updateUser, deleteUser } from '@/services/user.service';
import { userUpdateSchema } from '@/lib/validators/user.validator';
import { ZodError } from 'zod';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  const user = await getUserWithRelatedCounts(params.id);
  if (!user) return NextResponse.json({ success: false, message: 'Akun tidak ditemukan.' }, { status: 404 });
  return NextResponse.json({ success: true, data: user });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;
  if (!actorId || role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = userUpdateSchema.parse(body);
    const user = await updateUser(params.id, parsed, actorId);
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : 'Gagal memperbarui akun.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;
  if (!actorId || role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    await deleteUser(params.id, actorId);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus akun.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}