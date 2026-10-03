import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rejectSpeciesRecord } from '@/services/speciesRecord.service';
import { rejectRecordSchema } from '@/lib/validators/speciesRecord.validator';
import { ZodError } from 'zod';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Hanya Admin yang dapat menolak data.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { catatanRevisi } = rejectRecordSchema.parse(body);
    const result = await rejectSpeciesRecord(params.id, userId, catatanRevisi);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menolak data.' }, { status: 500 });
  }
}
