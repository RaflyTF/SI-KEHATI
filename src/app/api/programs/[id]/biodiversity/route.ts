import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProgramBiodiversityData } from '@/services/programBiodiversity.service';

// Endpoint ini PUBLIK (tanpa cek session) -- konsisten dengan halaman
// /program/[id] yang memang bisa diakses siapa saja tanpa login. Data yang
// diekspos (jumlah individu per spesies per tahun + hasil hitungannya)
// bukan data sensitif, sama seperti data yang sudah tampil di halaman
// publik "Status Flora & Fauna" sejak awal.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const program = await prisma.program.findUnique({ where: { id: params.id }, select: { id: true, status: true } });

  if (!program) {
    return NextResponse.json({ success: false, message: 'Program tidak ditemukan.' }, { status: 404 });
  }

  // Sama seperti aturan di getPublishedPrograms() -- program yang belum
  // "published" tidak boleh bocor datanya ke publik lewat endpoint mana pun,
  // termasuk endpoint biodiversitas ini.
  if (program.status !== 'published') {
    return NextResponse.json({ success: false, message: 'Program tidak ditemukan.' }, { status: 404 });
  }

  const data = await getProgramBiodiversityData(params.id);
  return NextResponse.json({ success: true, data });
}