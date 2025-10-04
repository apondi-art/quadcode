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

  // Calculate Y-axis domain with padding
  const minValue = Math.min(...data.values);
  const maxValue = Math.max(...data.values);
  const padding = (maxValue - minValue) * 0.1 || 1;
  const yDomain = [
    Math.floor((minValue - padding) * 10) / 10,
    Math.ceil((maxValue + padding) * 10) / 10
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Historical Time Series - {variableName}</CardTitle>
        <CardDescription className="text-xs">
          {variableName} values across years
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => value.toString()}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              domain={yDomain}
              label={{ value: `${unit}`, angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, variableName]}
            />
            <ReferenceLine
              y={data.statistics.mean}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: 'Mean', position: 'right', style: { fontSize: 10 } }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Range</p>
            <p className="text-sm font-semibold">
              {data.statistics.min.toFixed(1)} - {data.statistics.max.toFixed(1)} {unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Years</p>
            <p className="text-sm font-semibold">{data.years.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
