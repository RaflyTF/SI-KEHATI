/**
 * Service perhitungan Indeks Keanekaragaman Shannon-Wiener (H').
 *
 * Sengaja dipisah dari speciesRecord.service.ts (Single Responsibility Principle):
 * fungsi ini murni menerima angka dan mengembalikan angka, tidak menyentuh
 * database sama sekali -> mudah diuji dengan unit test tanpa koneksi database.
 *
 * Rumus:
 *   Pi     = ni / N            (proporsi individu spesies ke-i terhadap total N)
 *   ln(Pi) = logaritma natural dari Pi
 *   H'     = -Σ(Pi × ln Pi)     (dijumlahkan lintas seluruh spesies pada periode yang sama)
 *
 * Catatan: fungsi ini menghitung KONTRIBUSI satu spesies (satu baris SpeciesRecord).
 * Nilai "Total H'" per periode didapat dengan menjumlahkan seluruh h_value
 * pada periode yang sama (dilakukan di lapisan agregasi/dashboard).
 */

export interface SpeciesIndexResult {
  pi: number;
  lnPi: number;
  hValue: number;
}

export class InvalidBiodiversityInputError extends Error {}

/**
 * Menghitung Pi, ln(Pi), dan kontribusi H' untuk satu spesies.
 *
 * @param jumlahIndividuSpesies - jumlah individu (ni) spesies yang dihitung
 * @param totalIndividuPeriode - total seluruh individu (N) pada periode yang sama
 */
export function calculateSpeciesIndex(
  jumlahIndividuSpesies: number,
  totalIndividuPeriode: number
): SpeciesIndexResult {
  if (totalIndividuPeriode <= 0) {
    throw new InvalidBiodiversityInputError(
      'Total individu pada periode ini harus lebih dari 0 sebelum indeks dapat dihitung.'
    );
  }
  if (jumlahIndividuSpesies < 0) {
    throw new InvalidBiodiversityInputError('Jumlah individu tidak boleh negatif.');
  }
  if (jumlahIndividuSpesies === 0) {
    // Spesies dengan 0 individu pada periode ini tidak berkontribusi ke H'.
    return { pi: 0, lnPi: 0, hValue: 0 };
  }

  const pi = jumlahIndividuSpesies / totalIndividuPeriode;
  const lnPi = Math.log(pi);
  const hValue = -(pi * lnPi);

  return {
    pi: roundTo(pi, 4),
    lnPi: roundTo(lnPi, 4),
    hValue: roundTo(hValue, 4),
  };
}

/** Menjumlahkan seluruh kontribusi H' spesies pada satu periode menjadi Total H'. */
export function calculateTotalIndex(hValues: number[]): number {
  return roundTo(
    hValues.reduce((sum, h) => sum + h, 0),
    4
  );
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
