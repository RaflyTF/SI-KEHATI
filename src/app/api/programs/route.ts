// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { getPublishedPrograms, createProgram } from '@/services/program.service';
// import { prisma } from '@/lib/prisma';
// import { programInputSchema } from '@/lib/validators/program.validator';
// import { ZodError } from 'zod';

// export async function GET(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   const role = (session?.user as { role?: string } | undefined)?.role;
//   const includeAll = req.nextUrl.searchParams.get('all') === 'true';

//   // Parameter "all" hanya dihormati jika pengguna adalah Admin/Super Admin yang login.
//   // Publik / tidak login SELALU mendapat data published saja.
//   if (includeAll && (role === 'admin' || role === 'super_admin')) {
//     const data = await prisma.program.findMany({ include: { photos: true }, orderBy: { createdAt: 'desc' } });
//     return NextResponse.json({ success: true, data });
//   }

//   const data = await getPublishedPrograms();
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
//     const parsed = programInputSchema.parse(body);
//     const program = await createProgram(parsed, userId);
//     return NextResponse.json({ success: true, data: program }, { status: 201 });
//   } catch (err) {
//     if (err instanceof ZodError) {
//       return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
//     }
//     return NextResponse.json({ success: false, message: 'Gagal menyimpan program.' }, { status: 500 });
//   }
// }


// Kode Baru

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPublishedPrograms, getAllPrograms, createProgram } from '@/services/program.service';
import { programInputSchema } from '@/lib/validators/program.validator';
import { ZodError } from 'zod';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const includeAll = req.nextUrl.searchParams.get('all') === 'true';

  // Parameter "all" hanya dihormati jika pengguna adalah Admin/Super Admin yang login.
  // Publik / tidak login SELALU mendapat data published saja.
  if (includeAll && (role === 'admin' || role === 'super_admin')) {
    const data = await getAllPrograms();
    return NextResponse.json({ success: true, data });
  }

  const data = await getPublishedPrograms();
  return NextResponse.json({ success: true, data });
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
    const parsed = programInputSchema.parse(body);
    const program = await createProgram(parsed, userId);
    return NextResponse.json({ success: true, data: program }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: err.errors[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menyimpan program.' }, { status: 500 });
  }
}