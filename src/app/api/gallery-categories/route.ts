import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getGalleryCategories } from '@/services/gallery.service';
import { prisma } from '@/lib/prisma';
import { galleryCategoryInputSchema } from '@/lib/validators/gallery.validator';
import { ZodError } from 'zod';

export async function GET() {
  const data = await getGalleryCategories();
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Tidak diizinkan.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = galleryCategoryInputSchema.parse(body);
    const category = await prisma.galleryCategory.create({ data: parsed });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menambah kategori.' }, { status: 500 });
  }
}
