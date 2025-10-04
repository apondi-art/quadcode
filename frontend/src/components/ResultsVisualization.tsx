'use client';

import { WeatherQueryResponse } from '@/types/weather';
import StatisticsCards from './StatisticsCards';
import ProbabilityChart from './ProbabilityChart';
import TimeSeriesChart from './TimeSeriesChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResultsVisualizationProps {
  data: WeatherQueryResponse | null;
  loading: boolean;
}

export default function ResultsVisualization({ data, loading }: ResultsVisualizationProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">No data to display</p>
          <p className="text-sm text-muted-foreground">
            Select location, date, and variables, then click &quot;Analyze Weather&quot;
          </p>
        </div>
      </Card>
    );
  }

  const variables = Object.keys(data.historical_data);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <StatisticsCards data={data} />

      {/* Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            Based on {data.query_info.years_analyzed} years of data for{' '}
            <span className="font-medium">{data.query_info.requested_location.name}</span> on{' '}
            <span className="font-medium">{data.query_info.day_of_year}</span>:
          </p>
          {variables.map((variable) => {
            const varData = data.historical_data[variable];
            const unit = data.metadata.units[variable] || '';
            return (
              <p key={variable} className="text-sm text-muted-foreground">
                • {variable.charAt(0).toUpperCase() + variable.slice(1)}: Average of{' '}
                {varData.statistics.mean.toFixed(1)} {unit}, ranging from{' '}
                {varData.statistics.min.toFixed(1)} to {varData.statistics.max.toFixed(1)} {unit}
              </p>
            );
          })}
        </CardContent>
      </Card>

      {/* Charts for each variable */}
      {variables.map((variable) => {
        const varData = data.historical_data[variable];
        const unit = data.metadata.units[variable] || '';
        const variableName = variable.charAt(0).toUpperCase() + variable.slice(1).replace('_', ' ');

        return (
          <div key={variable} className="space-y-4">
            <Separator />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProbabilityChart variableName={variableName} data={varData} unit={unit} />
              <TimeSeriesChart variableName={variableName} data={varData} unit={unit} />
            </div>
          </div>
        );
      })}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Statistics</CardTitle>
          <CardDescription>Statistical summary of historical data</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Variable</th>
                    <th className="p-3 text-right font-medium">Mean</th>
                    <th className="p-3 text-right font-medium">Median</th>
                    <th className="p-3 text-right font-medium">Std Dev</th>
                    <th className="p-3 text-right font-medium">Min</th>
                    <th className="p-3 text-right font-medium">Max</th>
                  </tr>
                </thead>
                <tbody>
                  {variables.map((variable) => {
                    const varData = data.historical_data[variable];
                    const unit = data.metadata.units[variable] || '';
                    return (
                      <tr key={variable} className="border-b">
                        <td className="p-3 font-medium">
                          {variable.charAt(0).toUpperCase() + variable.slice(1).replace('_', ' ')}
                        </td>
                        <td className="p-3 text-right">
                          {varData.statistics.mean.toFixed(2)} {unit}
                        </td>
                        <td className="p-3 text-right">
                          {varData.statistics.median.toFixed(2)} {unit}
                        </td>
                        <td className="p-3 text-right">
                          {varData.statistics.std.toFixed(2)} {unit}
                        </td>
                        <td className="p-3 text-right">
                          {varData.statistics.min.toFixed(2)} {unit}
                        </td>
                        <td className="p-3 text-right">
                          {varData.statistics.max.toFixed(2)} {unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Data Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(data.metadata.data_sources).map(([key, source]) => (
            <div key={key} className="text-xs">
              <span className="font-medium">{key}:</span>{' '}
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {source.name}
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
