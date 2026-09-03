// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { deleteGalleryItem } from '@/services/gallery.service';

// export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions);
//   const role = (session?.user as { role?: string } | undefined)?.role;
//   const userId = (session?.user as { id?: string } | undefined)?.id;
//   if (!userId || (role !== 'admin' && role !== 'super_admin')) {
//     return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
//   }
//   await deleteGalleryItem(params.id, userId);
//   return NextResponse.json({ success: true });
// }


// Kode Baru

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGalleryItemById, updateGalleryItem, deleteGalleryItem } from '@/services/gallery.service';
import { galleryUpdateSchema } from '@/lib/validators/gallery.validator';
import { ZodError } from 'zod';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await getGalleryItemById(params.id);
  if (!item) return NextResponse.json({ success: false, message: 'Foto tidak ditemukan.' }, { status: 404 });
  return NextResponse.json({ success: true, data: item });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }
  try {
    const body = await req.json();
    const parsed = galleryUpdateSchema.parse(body);
    const item = await updateGalleryItem(params.id, parsed, userId);
    return NextResponse.json({ success: true, data: item });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : 'Gagal memperbarui foto.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }
  try {
    await deleteGalleryItem(params.id, userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus foto.';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}