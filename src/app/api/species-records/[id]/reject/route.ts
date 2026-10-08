import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rejectRecord } from '@/services/speciesRecord.service';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;

    if (!user?.id || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Hanya Verifikator/Admin yang diizinkan.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const catatan = String(body.catatanRevisi ?? '').trim();

    if (!catatan) {
      return NextResponse.json(
        { success: false, message: 'Catatan alasan penolakan/revisi wajib diisi.' },
        { status: 400 }
      );
    }

    const rejected = await rejectRecord(params.id, catatan, user.id);
    return NextResponse.json({
      success: true,
      data: rejected,
      message: 'Data rekaman berhasil ditolak dan dikembalikan untuk revisi.',
    });
  } catch (error: unknown) {
    console.error('Reject record error:', error);
    const message = error instanceof Error ? error.message : 'Gagal menolak data.';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}