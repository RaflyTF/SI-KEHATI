'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function TrendlineChart({ data }: { data: { periode: string; flora: number; fauna: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="periode" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Legend />
        <Bar dataKey="flora" name="Flora (Pohon)" fill="#3B6D11" radius={[4, 4, 0, 0]} />
        <Bar dataKey="fauna" name="Fauna (Ekor)" fill="#993C1D" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
