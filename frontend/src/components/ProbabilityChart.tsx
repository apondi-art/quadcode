'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VariableData } from '@/types/weather';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface ProbabilityChartProps {
  variableName: string;
  data: VariableData;
  unit: string;
}

export default function ProbabilityChart({ variableName, data, unit }: ProbabilityChartProps) {
  // Create histogram data from values
  const createHistogram = () => {
    const { values, statistics } = data;
    const bins = 10;
    const range = statistics.max - statistics.min;
    const binSize = range / bins;

    const histogram = Array.from({ length: bins }, (_, i) => {
      const binStart = statistics.min + i * binSize;
      const binEnd = binStart + binSize;
      const count = values.filter((v) => v >= binStart && v < binEnd).length;
      const probability = (count / values.length) * 100;

      return {
        range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
        binStart,
        probability,
        count,
      };
    });

    return histogram;
  };

  const histogramData = createHistogram();

  const maxProb = Math.max(...histogramData.map(d => d.probability));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Probability Distribution - {variableName}</CardTitle>
        <CardDescription className="text-xs">
          Distribution of {variableName.toLowerCase()} values
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={histogramData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              domain={[0, Math.ceil(maxProb * 1.1)]}
              label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
            />
            <Bar dataKey="probability" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Mean</p>
            <p className="text-sm font-semibold">
              {data.statistics.mean.toFixed(1)} {unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Median</p>
            <p className="text-sm font-semibold">
              {data.statistics.median.toFixed(1)} {unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Std Dev</p>
            <p className="text-sm font-semibold">
              {data.statistics.std.toFixed(1)} {unit}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
