'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VariableData } from '@/types/weather';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface TimeSeriesChartProps {
  variableName: string;
  data: VariableData;
  unit: string;
}

export default function TimeSeriesChart({ variableName, data, unit }: TimeSeriesChartProps) {
  const chartData = data.years.map((year, index) => ({
    year,
    value: data.values[index],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Time Series - {variableName}</CardTitle>
        <CardDescription>
          {variableName} values for the selected date across years
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12 }}
              label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: `${variableName} (${unit})`, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, variableName]}
            />
            <ReferenceLine
              y={data.statistics.mean}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label={{ value: 'Mean', position: 'right' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Range</p>
            <p className="text-sm font-semibold">
              {data.statistics.min.toFixed(1)} - {data.statistics.max.toFixed(1)} {unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Years Analyzed</p>
            <p className="text-sm font-semibold">{data.years.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
