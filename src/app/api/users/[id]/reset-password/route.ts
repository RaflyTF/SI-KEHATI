import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { resetUserPassword } from '@/services/user.service';
import { resetPasswordSchema } from '@/lib/validators/user.validator';
import { ZodError } from 'zod';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;
  if (!actorId || role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { newPassword } = resetPasswordSchema.parse(body);
    await resetUserPassword(params.id, newPassword, actorId);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : 'Gagal mereset password.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}