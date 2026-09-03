// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { getGalleryItems, createGalleryItem } from '@/services/gallery.service';
// import { galleryInputSchema } from '@/lib/validators/gallery.validator';
// import { ZodError } from 'zod';

// export async function GET(req: NextRequest) {
//   const categoryId = req.nextUrl.searchParams.get('category') ?? undefined;
//   const data = await getGalleryItems(categoryId);
//   return NextResponse.json({ success: true, data });
// }

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   const role = (session?.user as { role?: string } | undefined)?.role;
//   const userId = (session?.user as { id?: string } | undefined)?.id;
//   if (!userId || (role !== 'admin' && role !== 'super_admin')) {
//     return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
//   }

//   try {
//     const body = await req.json();
//     const parsed = galleryInputSchema.parse(body);
//     const item = await createGalleryItem(parsed, userId);
//     return NextResponse.json({ success: true, data: item }, { status: 201 });
//   } catch (err) {
//     if (err instanceof ZodError) {
//       return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
//     }
//     return NextResponse.json({ success: false, message: 'Gagal mengunggah foto.' }, { status: 500 });
//   }
// }


// Kode Baru

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGalleryItems, createGalleryItem } from '@/services/gallery.service';
import { galleryInputSchema } from '@/lib/validators/gallery.validator';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get('category') ?? undefined;
  const search = req.nextUrl.searchParams.get('search') ?? undefined;
  const pageParam = req.nextUrl.searchParams.get('page');
  const page = pageParam ? Number(pageParam) || 1 : undefined;
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize') ?? '8') || 8;

  const result = await getGalleryItems({ categoryId, search, page, pageSize });
  // "data" tetap berupa array (kompatibel dengan pemanggil lama seperti halaman
  // publik yang belum butuh pagination), sedangkan info pagination diletakkan
  // terpisah di "meta" supaya tidak ada breaking change pada konsumen yang sudah ada.
  return NextResponse.json({
    success: true,
    data: result.items,
    meta: { total: result.total, page: result.page, pageSize: result.pageSize, totalPages: result.totalPages },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId || (role !== 'admin' && role !== 'super_admin')) {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = galleryInputSchema.parse(body);
    const item = await createGalleryItem(parsed, userId);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal mengunggah foto.' }, { status: 500 });
  }
}