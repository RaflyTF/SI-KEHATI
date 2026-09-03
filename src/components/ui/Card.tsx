import clsx from 'clsx';

interface CardProps {
  className?: string;
  /**
   * Padding kartu, dipisah dari `className` secara sengaja.
   * Alasan: Tailwind tidak menjamin `p-4 md:p-5` yang dititipkan lewat
   * `className` akan meng-override `p-5` bawaan jika keduanya digabung
   * dalam satu string class (urutan menang di CSS hasil kompilasi Tailwind,
   * bukan urutan di HTML). Dengan prop terpisah, padding SELALU jadi
   * class utility paling akhir yang di-render, sehingga override selalu
   * berhasil dan dapat diprediksi.
   */
  padding?: string;
  children: React.ReactNode;
}

export function Card({ className, padding = 'p-5', children }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm',
        className,
        padding
      )}
    >
      {children}
    </div>
  );
}