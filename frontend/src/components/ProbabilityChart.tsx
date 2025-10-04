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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Probability Distribution - {variableName}</CardTitle>
        <CardDescription>
          Historical distribution showing probability of different {variableName.toLowerCase()} ranges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 12 }}
              label={{ value: `${variableName} (${unit})`, position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
            />
            <ReferenceLine
              x={data.statistics.mean}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label="Mean"
            />
            <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Mean</p>
            <p className="text-lg font-semibold">
              {data.statistics.mean.toFixed(1)} {unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Median</p>
            <p className="text-lg font-semibold">
              {data.statistics.median.toFixed(1)} {unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Std Dev</p>
            <p className="text-lg font-semibold">
              {data.statistics.std.toFixed(1)} {unit}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
