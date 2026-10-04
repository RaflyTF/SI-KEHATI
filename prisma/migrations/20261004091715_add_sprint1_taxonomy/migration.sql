-- CreateEnum
CREATE TYPE "StatusIucn" AS ENUM ('CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE');

-- CreateEnum
CREATE TYPE "StatusPerlindungan" AS ENUM ('DILINDUNGI', 'TIDAK_DILINDUNGI');

-- CreateEnum
CREATE TYPE "StatusCites" AS ENUM ('APPENDIX_I', 'APPENDIX_II', 'APPENDIX_III', 'NON_APPENDIX');

-- CreateEnum
CREATE TYPE "StatusKeberadaan" AS ENUM ('NATIVE', 'ENDEMIC', 'INTRODUCED', 'INVASIVE');

-- AlterTable
ALTER TABLE "species" ADD COLUMN     "deskripsi" TEXT,
ADD COLUMN     "famili" TEXT,
ADD COLUMN     "filum" TEXT,
ADD COLUMN     "foto_url" TEXT,
ADD COLUMN     "genus" TEXT,
ADD COLUMN     "habitat" TEXT,
ADD COLUMN     "kelas" TEXT,
ADD COLUMN     "kingdom" TEXT DEFAULT 'Animalia/Plantae',
ADD COLUMN     "nama_inggris" TEXT,
ADD COLUMN     "ordo" TEXT,
ADD COLUMN     "status_cites" "StatusCites" NOT NULL DEFAULT 'NON_APPENDIX',
ADD COLUMN     "status_iucn" "StatusIucn" NOT NULL DEFAULT 'LC',
ADD COLUMN     "status_keberadaan" "StatusKeberadaan" NOT NULL DEFAULT 'NATIVE',
ADD COLUMN     "status_perlindungan" "StatusPerlindungan" NOT NULL DEFAULT 'TIDAK_DILINDUNGI',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
