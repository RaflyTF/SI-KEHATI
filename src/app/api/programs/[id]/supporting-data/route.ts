import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Type assertion aman agar TypeScript Vercel tidak memblokir build
const db = prisma as any;

type Params = {
  params: {
    id: string;
  };
};

// GET - mengambil Data Pendukung berdasarkan program
export async function GET(
  _req: NextRequest,
  { params }: Params
) {
  try {
    const data = await db.programSupportingData.findMany({
      where: {
        programId: params.id,
      },
      orderBy: {
        namaDaerah: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('GET supporting data error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil Data Pendukung.',
      },
      { status: 500 }
    );
  }
}

// POST - menambahkan Data Pendukung
export async function POST(
  req: NextRequest,
  { params }: Params
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Tidak diizinkan.',
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const namaDaerah = String(body.namaDaerah ?? '').trim();

    if (!namaDaerah) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nama daerah wajib diisi.',
        },
        { status: 400 }
      );
    }

    const data = await db.programSupportingData.create({
      data: {
        programId: params.id,
        namaDaerah,
        jumlah2022: Number(body.jumlah2022 ?? 0),
        jumlah2023: Number(body.jumlah2023 ?? 0),
        jumlah2024: Number(body.jumlah2024 ?? 0),
        jumlah2025: Number(body.jumlah2025 ?? 0),
        jumlah2026: Number(body.jumlah2026 ?? 0),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Data Pendukung berhasil ditambahkan.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST supporting data error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan Data Pendukung.',
      },
      { status: 500 }
    );
  }
}

// PUT - mengubah Data Pendukung
export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Tidak diizinkan.',
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID Data Pendukung wajib diisi.',
        },
        { status: 400 }
      );
    }

    const existing = await db.programSupportingData.findFirst({
      where: {
        id: body.id,
        programId: params.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data Pendukung tidak ditemukan.',
        },
        { status: 404 }
      );
    }

    const namaDaerah = String(body.namaDaerah ?? '').trim();

    if (!namaDaerah) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nama daerah wajib diisi.',
        },
        { status: 400 }
      );
    }

    const data = await db.programSupportingData.update({
      where: {
        id: body.id,
      },
      data: {
        namaDaerah,
        jumlah2022: Number(body.jumlah2022 ?? 0),
        jumlah2023: Number(body.jumlah2023 ?? 0),
        jumlah2024: Number(body.jumlah2024 ?? 0),
        jumlah2025: Number(body.jumlah2025 ?? 0),
        jumlah2026: Number(body.jumlah2026 ?? 0),
      },
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Data Pendukung berhasil diperbarui.',
    });
  } catch (error) {
    console.error('PUT supporting data error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui Data Pendukung.',
      },
      { status: 500 }
    );
  }
}

// DELETE - menghapus Data Pendukung
export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Tidak diizinkan.',
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          message: 'ID Data Pendukung wajib diisi.',
        },
        { status: 400 }
      );
    }

    const existing = await db.programSupportingData.findFirst({
      where: {
        id: body.id,
        programId: params.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data Pendukung tidak ditemukan.',
        },
        { status: 404 }
      );
    }

    await db.programSupportingData.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Data Pendukung berhasil dihapus.',
    });
  } catch (error) {
    console.error('DELETE supporting data error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus Data Pendukung.',
      },
      { status: 500 }
    );
  }
}