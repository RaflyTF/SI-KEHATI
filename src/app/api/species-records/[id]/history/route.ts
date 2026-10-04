import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSpeciesRecordById } from '@/services/speciesRecord.service';
import { getAuditHistoryForRecord } from '@/services/audit.service';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  const record = await getSpeciesRecordById(params.id);
  if (!record) {
    return NextResponse.json({ success: false, message: 'Data tidak ditemukan.' }, { status: 404 });
  }

  if (role === 'petugas_lapangan' && record.inputBy !== userId) {
    return NextResponse.json({ success: false, message: 'Anda tidak memiliki akses ke riwayat data ini.' }, { status: 403 });
  }

  const history = await getAuditHistoryForRecord('species_records', params.id);
  return NextResponse.json({ success: true, data: history });
}