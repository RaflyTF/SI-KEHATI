import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifyRecord } from '@/services/speciesRecord.service';

export const dynamic = 'force-dynamic';

export async function POST(
  _req: NextRequest,
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

    const verified = await verifyRecord(params.id, user.id);
    return NextResponse.json({
      success: true,
      data: verified,
      message: 'Data rekaman berhasil diverifikasi dan dipublikasikan.',
    });
  } catch (error: unknown) {
    console.error('Verify record error:', error);
    const message = error instanceof Error ? error.message : 'Gagal memverifikasi data.';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}