import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jenis = searchParams.get('jenis');
    const dilindungi = searchParams.get('dilindungi');
    const search = searchParams.get('search');

    const where: Prisma.SpeciesWhereInput = {};

    if (jenis === 'flora' || jenis === 'fauna') {
      where.jenis = jenis;
    }

    if (dilindungi === 'true') {
      where.statusPerlindungan = 'DILINDUNGI';
    }

    if (search) {
      where.OR = [
        { namaLokal: { contains: search, mode: 'insensitive' } },
        { namaIlmiah: { contains: search, mode: 'insensitive' } },
        { famili: { contains: search, mode: 'insensitive' } },
      ];
    }

    const data = await prisma.species.findMany({
      where,
      orderBy: [
        { jenis: 'asc' },
        { namaLokal: 'asc' },
      ],
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching species:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data spesies.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const created = await prisma.species.create({ data: body });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating species:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan spesies.' },
      { status: 500 }
    );
  }
}