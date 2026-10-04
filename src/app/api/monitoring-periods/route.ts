import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const data = await prisma.monitoringPeriod.findMany({
    where: {
      tahun: {
        gte: 2022,
        lte: 2026,
      },
      semester: {
        in: ['1', '2'],
      },
    },
    orderBy: [
      { tahun: 'asc' },
      { semester: 'asc' },
    ],
  });

  return NextResponse.json({
    success: true,
    data,
  });
}
export async function POST(req: NextRequest) {
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

  try {
    const body = await req.json();

    const tahun = Number(body.tahun);
    const semester = String(body.semester);

    // Validasi tahun
    if (!Number.isInteger(tahun) || tahun < 2022) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tahun periode tidak valid.',
        },
        { status: 400 }
      );
    }

    // Hanya Semester 1 atau Semester 2
    if (semester !== '1' && semester !== '2') {
      return NextResponse.json(
        {
          success: false,
          message: 'Semester hanya boleh 1 atau 2.',
        },
        { status: 400 }
      );
    }

    // Cek apakah periode sudah ada
    const existing = await prisma.monitoringPeriod.findUnique({
      where: {
        tahun_semester: {
          tahun,
          semester,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: `Periode ${tahun} - Semester ${semester} sudah tersedia.`,
        },
        { status: 409 }
      );
    }

    const period = await prisma.monitoringPeriod.create({
      data: {
        tahun,
        semester,
        label: `${tahun} - Semester ${semester}`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: period,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Gagal menambahkan periode:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan periode monitoring.',
      },
      { status: 500 }
    );
  }
}