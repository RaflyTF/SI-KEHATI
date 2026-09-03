'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { RECORD_STATUS_LABELS, RECORD_STATUS_COLORS, AUDIT_ACTION_LABELS, ROLE_LABELS } from '@/lib/constants';

interface RecordDetail {
  id: string;
  jumlahIndividu: number;
  status: string;
  catatanRevisi: string | null;
  createdAt: string;
  species: { namaLokal: string; namaIlmiah: string; jenis: string };
  period: { label: string | null; tahun: number };
  inputter: { nama: string };
  verifier: { nama: string } | null;
  index: { pi: number; lnPi: number; hValue: number } | null;
}

interface HistoryEntry {
  id: string;
  aksi: string;
  createdAt: string;
  user: { nama: string; role: string };
}

export function SpeciesRecordDetailModal({
  open,
  onClose,
  recordId,
}: {
  open: boolean;
  onClose: () => void;
  recordId: string | null;
}) {
  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !recordId) return;
    setLoading(true);
    setError('');
    setRecord(null);
    setHistory([]);

    Promise.all([
      fetch(`/api/species-records/${recordId}`).then((r) => r.json()),
      fetch(`/api/species-records/${recordId}/history`).then((r) => r.json()),
    ])
      .then(([recordJson, historyJson]) => {
        if (!recordJson.success) throw new Error(recordJson.message ?? 'Gagal memuat detail data.');
        setRecord(recordJson.data);
        setHistory(historyJson.success ? historyJson.data ?? [] : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat detail data.'))
      .finally(() => setLoading(false));
  }, [open, recordId]);

  return (
    <Modal open={open} onClose={onClose} title="Detail Data Monitoring">
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : record ? (
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-gray-500 dark:text-gray-400">Spesies</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">
              {record.species.namaLokal} <span className="italic text-xs">({record.species.namaIlmiah})</span>
            </dd>
            <dt className="text-gray-500 dark:text-gray-400">Jenis</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">
              {record.species.jenis === 'flora' ? 'Flora' : 'Fauna'}
            </dd>
            <dt className="text-gray-500 dark:text-gray-400">Periode</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">{record.period.label ?? record.period.tahun}</dd>
            <dt className="text-gray-500 dark:text-gray-400">Jumlah Individu</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">{record.jumlahIndividu}</dd>
            <dt className="text-gray-500 dark:text-gray-400">Status</dt>
            <dd className="text-right">
              <Badge status={record.status} labels={RECORD_STATUS_LABELS} colors={RECORD_STATUS_COLORS} />
            </dd>
            <dt className="text-gray-500 dark:text-gray-400">Diinput oleh</dt>
            <dd className="text-gray-800 dark:text-gray-200 text-right">{record.inputter.nama}</dd>
            {record.verifier && (
              <>
                <dt className="text-gray-500 dark:text-gray-400">
                  {record.status === 'rejected' ? 'Ditolak oleh' : 'Diverifikasi oleh'}
                </dt>
                <dd className="text-gray-800 dark:text-gray-200 text-right">{record.verifier.nama}</dd>
              </>
            )}
            {record.index && (
              <>
                <dt className="text-gray-500 dark:text-gray-400">Indeks H&apos;</dt>
                <dd className="text-gray-800 dark:text-gray-200 text-right">{record.index.hValue.toFixed(4)}</dd>
              </>
            )}
          </dl>

          {record.status === 'rejected' && record.catatanRevisi && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3">
              <p className="text-xs font-medium text-danger mb-1">Catatan Revisi</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{record.catatanRevisi}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Riwayat Perubahan</p>
            {history.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada riwayat tercatat.</p>
            ) : (
              <ol className="space-y-2 border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                {history.map((h) => (
                  <li key={h.id} className="text-sm">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {AUDIT_ACTION_LABELS[h.aksi] ?? h.aksi}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      oleh {h.user.nama} ({ROLE_LABELS[h.user.role] ?? h.user.role}) &middot;{' '}
                      {new Date(h.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
}