-- CreateEnum
CREATE TYPE "Role" AS ENUM ('petugas_lapangan', 'admin', 'super_admin');

-- CreateEnum
CREATE TYPE "JenisSpesies" AS ENUM ('flora', 'fauna');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('draft', 'pending', 'published', 'rejected');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "species" (
    "id" TEXT NOT NULL,
    "nama_lokal" TEXT NOT NULL,
    "nama_ilmiah" TEXT NOT NULL,
    "jenis" "JenisSpesies" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitoring_periods" (
    "id" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "monitoring_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "species_records" (
    "id" TEXT NOT NULL,
    "species_id" TEXT NOT NULL,
    "period_id" TEXT NOT NULL,
    "jumlah_individu" INTEGER NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'draft',
    "catatan_revisi" TEXT,
    "input_by" TEXT NOT NULL,
    "verified_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "species_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biodiversity_index" (
    "id" TEXT NOT NULL,
    "species_record_id" TEXT NOT NULL,
    "pi" DOUBLE PRECISION NOT NULL,
    "ln_pi" DOUBLE PRECISION NOT NULL,
    "h_value" DOUBLE PRECISION NOT NULL,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biodiversity_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "anggaran" DOUBLE PRECISION NOT NULL,
    "status" "ProgramStatus" NOT NULL DEFAULT 'draft',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_species_data" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "species_id" TEXT NOT NULL,
    "period_id" TEXT NOT NULL,
    "jumlah_individu" INTEGER NOT NULL,

    CONSTRAINT "program_species_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_photos" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "program_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_categories" (
    "id" TEXT NOT NULL,
    "nama_kategori" TEXT NOT NULL,

    CONSTRAINT "gallery_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "aksi" TEXT NOT NULL,
    "tabel_terkait" TEXT NOT NULL,
    "data_sebelum" JSONB,
    "data_sesudah" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "monitoring_periods_tahun_semester_key" ON "monitoring_periods"("tahun", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "biodiversity_index_species_record_id_key" ON "biodiversity_index"("species_record_id");

-- AddForeignKey
ALTER TABLE "species_records" ADD CONSTRAINT "species_records_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "species_records" ADD CONSTRAINT "species_records_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "monitoring_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "species_records" ADD CONSTRAINT "species_records_input_by_fkey" FOREIGN KEY ("input_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "species_records" ADD CONSTRAINT "species_records_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biodiversity_index" ADD CONSTRAINT "biodiversity_index_species_record_id_fkey" FOREIGN KEY ("species_record_id") REFERENCES "species_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_species_data" ADD CONSTRAINT "program_species_data_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_species_data" ADD CONSTRAINT "program_species_data_species_id_fkey" FOREIGN KEY ("species_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_species_data" ADD CONSTRAINT "program_species_data_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "monitoring_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_photos" ADD CONSTRAINT "program_photos_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "gallery_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
