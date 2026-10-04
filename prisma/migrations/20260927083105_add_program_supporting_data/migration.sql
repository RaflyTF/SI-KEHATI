-- CreateTable
CREATE TABLE "program_supporting_data" (
    "id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "nama_daerah" TEXT NOT NULL,
    "jumlah_2022" INTEGER NOT NULL DEFAULT 0,
    "jumlah_2023" INTEGER NOT NULL DEFAULT 0,
    "jumlah_2024" INTEGER NOT NULL DEFAULT 0,
    "jumlah_2026" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "program_supporting_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "program_supporting_data" ADD CONSTRAINT "program_supporting_data_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
