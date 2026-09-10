'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartPoint {
  periode: string;
  totalH: number;
}

export function ProgramIndexChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="periode" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalH" name="Total Indeks H'" stroke="#0F6E56" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}