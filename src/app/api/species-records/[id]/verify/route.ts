import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifySpeciesRecord } from '@/services/speciesRecord.service';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Hanya Admin yang dapat memverifikasi data.' }, { status: 403 });
  }

  try {
    const result = await verifySpeciesRecord(params.id, userId);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal memverifikasi data.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
