import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { recordAuditLog } from '@/services/audit.service';
import { userInputSchema } from '@/lib/validators/user.validator';
import { ZodError } from 'zod';

// Manajemen akun -- KHUSUS Super Admin (FR pada SRS: hak akses berjenjang).
export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }
  const data = await prisma.user.findMany({
    select: { id: true, nama: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const actorId = (session?.user as { id?: string } | undefined)?.id;
  if (!actorId || role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = userInputSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Email sudah terdaftar.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);
    const user = await prisma.user.create({
      data: { nama: parsed.nama, email: parsed.email, passwordHash, role: parsed.role },
      select: { id: true, nama: true, email: true, role: true, isActive: true },
    });

    await recordAuditLog({ userId: actorId, aksi: 'create', tabelTerkait: 'users', dataSesudah: user });
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menambah akun.' }, { status: 500 });
  }
}
