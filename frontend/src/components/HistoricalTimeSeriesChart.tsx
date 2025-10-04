'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface HistoricalTimeSeriesChartProps {
  data: Array<{
    year: number;
    temperature: number;
    precipitation: number;
    humidity: number;
  }>;
  title?: string;
  description?: string;
}

const chartConfig = {
  temperature: {
    label: 'Temperature (°C)',
    color: '#ef4444',
  },
  precipitation: {
    label: 'Precipitation (mm)',
    color: '#3b82f6',
  },
  humidity: {
    label: 'Humidity (%)',
    color: '#10b981',
  },
};

export default function HistoricalTimeSeriesChart({
  data,
  title = 'Historical Time Series',
  description = 'Multi-year weather trends',
}: HistoricalTimeSeriesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={data}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="year"
              label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
              className="text-xs"
            />
            <YAxis
              label={{ value: 'Values', angle: -90, position: 'insideLeft' }}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="url(#tempGradient)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="precipitation"
              stroke={chartConfig.precipitation.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke={chartConfig.humidity.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
