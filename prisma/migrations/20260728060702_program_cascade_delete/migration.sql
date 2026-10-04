-- DropForeignKey
ALTER TABLE "program_photos" DROP CONSTRAINT "program_photos_program_id_fkey";

-- DropForeignKey
ALTER TABLE "program_species_data" DROP CONSTRAINT "program_species_data_program_id_fkey";

-- AddForeignKey
ALTER TABLE "program_species_data" ADD CONSTRAINT "program_species_data_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_photos" ADD CONSTRAINT "program_photos_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
