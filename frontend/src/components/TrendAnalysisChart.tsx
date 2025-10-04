"use client";

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendAnalysis, VariableData } from '@/types/weather';

interface TrendAnalysisChartProps {
  variableName: string;
  data: VariableData;
  unit: string;
}

export default function TrendAnalysisChart({ variableName, data, unit }: TrendAnalysisChartProps) {
  const trend = data.statistics.trend;

  if (!trend || !trend.slope) {
    return null;
  }

  // Prepare data for the chart
  const chartData = data.years.map((year, index) => ({
    year,
    actual: parseFloat(data.values[index].toFixed(2)),
    trend: parseFloat((trend.slope! * year + (trend.intercept || 0)).toFixed(2))
  }));

  const chartConfig = {
    actual: {
      label: "Actual",
      color: "#3b82f6", // blue-500
    },
    trend: {
      label: "Trend Line",
      color: "#f59e0b", // amber-500
    },
  } satisfies ChartConfig;

  const getTrendIcon = () => {
    switch (trend.trend_direction) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const trendDescription = trend.trend_direction === 'increasing'
    ? `Increasing by ${Math.abs(trend.percent_change || 0).toFixed(1)}%`
    : trend.trend_direction === 'decreasing'
    ? `Decreasing by ${Math.abs(trend.percent_change || 0).toFixed(1)}%`
    : 'Stable trend';

  // Calculate Y-axis domain with padding
  const allValues = [...chartData.map(d => d.actual), ...chartData.map(d => d.trend)];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.15 || 1;
  const yDomain = [
    Math.floor((minValue - padding) * 10) / 10,
    Math.ceil((maxValue + padding) * 10) / 10
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{variableName} Trend</CardTitle>
        <CardDescription className="text-xs">
          {data.years[0]} - {data.years[data.years.length - 1]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 5,
              left: 5,
              right: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 9 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 9 }}
              domain={yDomain}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="actual"
              type="monotone"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{
                fill: "#3b82f6",
                r: 3,
              }}
              activeDot={{
                r: 5,
              }}
              connectNulls
            />
            <Line
              dataKey="trend"
              type="monotone"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs pt-2">
        <div className="flex gap-2 leading-none font-medium">
          {trendDescription} {getTrendIcon()}
        </div>
        <div className="text-muted-foreground leading-none text-xs">
          R² = {trend.r_squared?.toFixed(3)}
          {trend.r_squared && trend.r_squared > 0.7 && " (strong)"}
          {trend.r_squared && trend.r_squared > 0.4 && trend.r_squared <= 0.7 && " (moderate)"}
          {trend.r_squared && trend.r_squared <= 0.4 && " (weak)"}
        </div>
      </CardFooter>
    </Card>
  );
}
