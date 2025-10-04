'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardsProps {
  location: string;
  bestConditionPercentage: number;
  extremeAlerts: number;
  historicalTrend: 'up' | 'down' | 'stable';
}

export default function SummaryCards({
  location,
  bestConditionPercentage,
  extremeAlerts,
  historicalTrend,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Location Info Card */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Location</CardTitle>
          <MapPin className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{location}</div>
          <p className="text-xs text-muted-foreground mt-1">Analysis region</p>
        </CardContent>
      </Card>

      {/* Best Conditions Card */}
      <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Conditions</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bestConditionPercentage}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Historical probability
          </p>
        </CardContent>
      </Card>

      {/* Extreme Alerts Card */}
      <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Extreme Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{extremeAlerts}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Days exceeding threshold
          </p>
        </CardContent>
      </Card>

      {/* Historical Trend Card */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Historical Trend</CardTitle>
          {historicalTrend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-purple-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-purple-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{historicalTrend}</div>
          <p className="text-xs text-muted-foreground mt-1">
            5-year pattern analysis
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
