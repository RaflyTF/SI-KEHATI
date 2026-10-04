interface ConservationBadgeProps {
  iucn?: string;
  perlindungan?: string;
}

export function ConservationBadge({ iucn, perlindungan }: ConservationBadgeProps) {
  const iucnDots: Record<string, string> = {
    CR: 'bg-red-500',
    EN: 'bg-orange-500',
    VU: 'bg-amber-500',
    NT: 'bg-yellow-500',
    LC: 'bg-emerald-500',
    DD: 'bg-zinc-400',
  };

  const iucnLabels: Record<string, string> = {
    CR: 'Kritis (CR)',
    EN: 'Genting (EN)',
    VU: 'Rentan (VU)',
    NT: 'Hampir Terancam (NT)',
    LC: 'Risiko Rendah (LC)',
    DD: 'Kurang Data (DD)',
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {perlindungan === 'DILINDUNGI' && (
        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          Dilindungi UU
        </span>
      )}

      {iucn && (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          <span className={`h-1.5 w-1.5 rounded-full ${iucnDots[iucn] ?? 'bg-zinc-400'}`} />
          IUCN: {iucnLabels[iucn] ?? iucn}
        </span>
      )}
    </div>
  );
}