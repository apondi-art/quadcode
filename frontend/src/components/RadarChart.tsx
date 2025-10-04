'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface RadarChartProps {
  data: Array<{
    variable: string;
    value: number;
    fullMark: number;
  }>;
  title?: string;
  description?: string;
}

const chartConfig = {
  value: {
    label: 'Current Value',
    color: '#0ea5e9',
  },
};

export default function RadarChart({
  data,
  title = 'Multi-Variable Comparison',
  description = 'Radar chart showing relative values across variables',
}: RadarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <RechartsRadarChart data={data}>
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <PolarGrid strokeDasharray="3 3" className="stroke-muted" />
            <PolarAngleAxis
              dataKey="variable"
              className="text-xs"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${Number(value).toFixed(1)}`, 'Value']}
                />
              }
            />
            <Radar
              name="Variables"
              dataKey="value"
              stroke="url(#radarGradient)"
              fill="url(#radarGradient)"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </RechartsRadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
