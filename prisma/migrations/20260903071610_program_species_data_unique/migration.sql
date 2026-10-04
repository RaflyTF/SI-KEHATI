/*
  Warnings:

  - A unique constraint covering the columns `[program_id,species_id,period_id]` on the table `program_species_data` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "program_species_data_program_id_species_id_period_id_key" ON "program_species_data"("program_id", "species_id", "period_id");
