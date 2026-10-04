import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    // Cek login dan role
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

    // Ambil FormData
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: 'File foto belum dipilih.',
        },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Format foto harus JPG, PNG, atau WebP.',
        },
        { status: 400 }
      );
    }

    // Maksimal 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ukuran foto maksimal 5 MB.',
        },
        { status: 400 }
      );
    }

    // Buat nama file yang aman
    const extension = path.extname(file.name) || '.jpg';

    const safeName = path
      .basename(file.name, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase();

    const fileName = `${Date.now()}-${safeName}${extension}`;

    // Lokasi penyimpanan
    const uploadDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'gallery'
    );

    // Pastikan folder tersedia
    await mkdir(uploadDir, { recursive: true });

    // Ubah File menjadi Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Simpan file
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // URL yang disimpan ke database
    const fileUrl = `/uploads/gallery/${fileName}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          fileUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Gallery upload error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengunggah foto.',
      },
      { status: 500 }
    );
  }
}