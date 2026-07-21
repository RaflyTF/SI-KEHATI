import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/services/audit.service';

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;
  if (!actorId || role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  const before = await prisma.user.findUnique({ where: { id: params.id } });
  const after = await prisma.user.update({ where: { id: params.id }, data: { isActive: false } });

  await recordAuditLog({
    userId: actorId,
    aksi: 'update',
    tabelTerkait: 'users',
    dataSebelum: before,
    dataSesudah: after,
  });

  return NextResponse.json({ success: true, data: after });
}
