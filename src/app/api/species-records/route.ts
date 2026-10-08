import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSpeciesRecords, createSpeciesRecord } from '@/services/speciesRecord.service';
import { RecordStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;

    const { searchParams } = new URL(req.url);
    const periodId = searchParams.get('periodId') || undefined;
    const speciesId = searchParams.get('speciesId') || undefined;
    const statusParam = (searchParams.get('status') as RecordStatus) || undefined;
    const scope = searchParams.get('scope') || undefined;

    // Untuk publik tanpa login, paksa hanya menampilkan data yang sudah dipublikasikan
    const status = !user ? RecordStatus.published : statusParam;

    const data = await getSpeciesRecords({
      periodId,
      speciesId,
      status,
      userId: user?.id,
      role: user?.role,
      scope,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Get species records error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat rekaman spesies.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string; role?: string } | undefined;

    if (!user?.id) {
      return NextResponse.json(
        { success: false, message: 'Harap masuk ke akun terlebih dahulu.' },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.speciesId || !body.periodId || body.jumlahIndividu === undefined) {
      return NextResponse.json(
        { success: false, message: 'Spesies, periode, dan jumlah individu wajib diisi.' },
        { status: 400 }
      );
    }

    const jumlahIndividu = Number(body.jumlahIndividu);
    if (isNaN(jumlahIndividu) || jumlahIndividu < 0) {
      return NextResponse.json(
        { success: false, message: 'Jumlah individu harus berupa angka non-negatif.' },
        { status: 400 }
      );
    }

    // RBAC: Petugas lapangan hanya boleh menyimpan draft atau mengajukan (pending)
    let requestedStatus: RecordStatus = body.status ?? RecordStatus.draft;
    if (user.role === 'petugas_lapangan' && requestedStatus === RecordStatus.published) {
      requestedStatus = RecordStatus.pending;
    }

    const created = await createSpeciesRecord(
      {
        speciesId: String(body.speciesId),
        periodId: String(body.periodId),
        jumlahIndividu,
        status: requestedStatus,
      },
      user.id
    );

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create species record error:', error);
    const message = error instanceof Error ? error.message : 'Gagal mencatat data temuan.';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}