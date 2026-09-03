-- DropForeignKey
ALTER TABLE "biodiversity_index" DROP CONSTRAINT "biodiversity_index_species_record_id_fkey";

-- AddForeignKey
ALTER TABLE "biodiversity_index" ADD CONSTRAINT "biodiversity_index_species_record_id_fkey" FOREIGN KEY ("species_record_id") REFERENCES "species_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
