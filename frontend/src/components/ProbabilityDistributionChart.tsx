'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';

interface ProbabilityDistributionChartProps {
  data: Array<{ value: number; probability: number }>;
  threshold?: number;
  title?: string;
  description?: string;
}

const chartConfig = {
  probability: {
    label: 'Probability',
    color: 'hsl(var(--chart-1))',
  },
};

export default function ProbabilityDistributionChart({
  data,
  threshold = 30,
  title = 'Probability Distribution',
  description = 'Bell curve showing historical weather patterns',
}: ProbabilityDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="probabilityGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="url(#probabilityGradient)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="url(#probabilityGradient)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="value"
              label={{ value: 'Value', position: 'insideBottom', offset: -5 }}
              className="text-xs"
            />
            <YAxis
              label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
              className="text-xs"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Probability']}
                />
              }
            />
            <ReferenceLine
              x={threshold}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: `Threshold: ${threshold}`, position: 'top', fill: '#ef4444' }}
            />
            <Area
              type="monotone"
              dataKey="probability"
              stroke="url(#probabilityGradient)"
              strokeWidth={2}
              fill="url(#fillGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
