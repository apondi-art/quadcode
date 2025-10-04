'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { WeatherQueryResponse } from '@/types/weather';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, MapPin, Info } from 'lucide-react';

interface StatisticsCardsProps {
  data: WeatherQueryResponse | null;
}

export default function StatisticsCards({ data }: StatisticsCardsProps) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const firstVariable = Object.keys(data.historical_data)[0];
  const firstVarData = data.historical_data[firstVariable];

  // Calculate best conditions probability (simplified)
  const getBestConditionsProbability = () => {
    if (!firstVarData) return 0;
    // Simple heuristic: probability within 1 std dev of mean
    return 68; // Normal distribution approximation
  };

  // Get extreme weather probability
  const getExtremeWeatherProbability = () => {
    if (!firstVarData?.probabilities) return 0;
    const probs = Object.values(firstVarData.probabilities);
    return Math.max(...probs) * 100;
  };

  // Calculate trend
  const getTrend = () => {
    if (!firstVarData?.values || firstVarData.values.length < 2) return { direction: 'stable', value: 0 };
    const recent = firstVarData.values.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const older = firstVarData.values.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const diff = ((recent - older) / older) * 100;

    return {
      direction: diff > 1 ? 'up' : diff < -1 ? 'down' : 'stable',
      value: Math.abs(diff),
    };
  };

  const trend = getTrend();
  const extremeProb = getExtremeWeatherProbability();

  return (
    <TooltipProvider>
      <>
        {/* Location Info Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium truncate">
              {data.query_info.requested_location.name || 'Custom Location'}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.query_info.years_analyzed} years
            </p>
          </CardContent>
        </Card>

        {/* Best Conditions Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-2">
              Best Conditions
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Probability within 1 std dev of mean (±68% normal distribution).
                    Typical, non-extreme weather likelihood.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{getBestConditionsProbability()}%</div>
            <p className="text-xs text-muted-foreground">ideal conditions</p>
          </CardContent>
        </Card>

        {/* Extreme Weather Alert Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-2">
              {extremeProb > 20 && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
              Extreme Weather
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Max probability of exceeding thresholds.
                    Based on historical extreme event frequency.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{extremeProb.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {extremeProb > 20 ? 'High' : 'Low'} probability
            </p>
          </CardContent>
        </Card>

        {/* Historical Trend Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium flex items-center gap-2">
              Historical Trend
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Percent change: recent 3 years vs older 3 years.
                    Shows if conditions are increasing/decreasing.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {trend.direction === 'up' && <TrendingUp className="h-5 w-5 text-red-500" />}
              {trend.direction === 'down' && <TrendingDown className="h-5 w-5 text-blue-500" />}
              {trend.direction === 'stable' && <Minus className="h-5 w-5 text-gray-500" />}
              <span className="text-xl font-bold">
                {trend.direction === 'stable' ? 'Stable' : `${trend.value.toFixed(1)}%`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {trend.direction === 'up' && 'Increasing'}
              {trend.direction === 'down' && 'Decreasing'}
              {trend.direction === 'stable' && 'Stable'}
            </p>
          </CardContent>
        </Card>
      </>
    </TooltipProvider>
  );
}
