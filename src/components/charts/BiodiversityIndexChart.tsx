'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function BiodiversityIndexChart({ data }: { data: { periode: string; flora: number; fauna: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="periode" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="flora" name="Indeks H' Flora" stroke="#0F6E56" strokeWidth={2} />
        <Line type="monotone" dataKey="fauna" name="Indeks H' Fauna" stroke="#BA7517" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
