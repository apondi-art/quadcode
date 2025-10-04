'use client';

import { useState } from 'react';
import { WeatherQueryResponse } from '@/types/weather';
import StatisticsCards from './StatisticsCards';
import ProbabilityChart from './ProbabilityChart';
import TimeSeriesChart from './TimeSeriesChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { exportToCSV, exportToJSON, downloadFile, generateFilename } from '@/lib/exportUtils';

interface ResultsVisualizationProps {
  data: WeatherQueryResponse | null;
  loading: boolean;
}

type SortField = 'variable' | 'mean' | 'median' | 'std' | 'min' | 'max';
type SortDirection = 'asc' | 'desc';

export default function ResultsVisualization({ data, loading }: ResultsVisualizationProps) {
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [sortField, setSortField] = useState<SortField>('variable');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleDownload = (format: 'csv' | 'json') => {
    if (!data) return;

    const content = format === 'csv' ? exportToCSV(data) : exportToJSON(data);
    const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
    const filename = generateFilename(data, format);

    downloadFile(content, filename, mimeType);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  // Sort variables based on selected field
  const sortedVariables = [...variables].sort((a, b) => {
    if (sortField === 'variable') {
      return sortDirection === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    }
    const aValue = data.historical_data[a].statistics[sortField];
    const bValue = data.historical_data[b].statistics[sortField];
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="space-y-6">
      {/* Download Buttons */}
      <div className="flex gap-2 justify-end">
        <Button onClick={() => handleDownload('csv')} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
        <Button onClick={() => handleDownload('json')} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download JSON
        </Button>
      </div>

      {/* Summary Cards */}
      <StatisticsCards data={data} />

      {/* Enhanced Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Analysis Insights</CardTitle>
          <CardDescription>
            AI-generated summary based on historical weather patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed">
              Based on {data.query_info.years_analyzed} years of historical data for{' '}
              <span className="font-semibold">{data.query_info.requested_location.name}</span> on{' '}
              <span className="font-semibold">{data.query_info.day_of_year}</span>, here&apos;s what the data reveals:
            </p>

            {variables.map((variable) => {
              const varData = data.historical_data[variable];
              const unit = data.metadata.units[variable] || '';
              const stats = varData.statistics;
              const variableName = variable.charAt(0).toUpperCase() + variable.slice(1).replace('_', ' ');

              // Generate insights based on variability
              const variability = stats.std / stats.mean;
              const variabilityText = variability > 0.3 ? 'high variability' : variability > 0.15 ? 'moderate variability' : 'consistent conditions';

              return (
                <div key={variable} className="border-l-4 border-primary/30 pl-4 py-2">
                  <p className="text-sm font-medium text-foreground">
                    {variableName}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Expect an average of <span className="font-medium text-foreground">{stats.mean.toFixed(1)} {unit}</span>, with {variabilityText}.
                    Historical values have ranged from {stats.min.toFixed(1)} to {stats.max.toFixed(1)} {unit}.
                    {varData.probabilities && Object.keys(varData.probabilities).length > 0 && (
                      <span>
                        {' '}Threshold probabilities: {Object.entries(varData.probabilities).map(([threshold, prob]) =>
                          `${threshold.replace('_', ' ')} (${(prob * 100).toFixed(0)}%)`
                        ).join(', ')}.
                      </span>
                    )}
                  </p>
                </div>
              );
            })}

            <p className="text-xs text-muted-foreground italic mt-4">
              Note: These insights are generated from historical data patterns and should be used as general guidance for planning purposes.
            </p>
          </div>
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

      {/* Expandable Sortable Data Table */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsTableExpanded(!isTableExpanded)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Raw Statistics
                {isTableExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CardTitle>
              <CardDescription>
                {isTableExpanded ? 'Click to collapse' : 'Click to expand'} detailed statistical summary
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {isTableExpanded && (
          <CardContent>
            <ScrollArea className="w-full">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th
                        className="p-3 text-left font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleSort('variable')}
                      >
                        <div className="flex items-center gap-1">
                          Variable
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="p-3 text-right font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleSort('mean')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Mean
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="p-3 text-right font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleSort('median')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Median
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="p-3 text-right font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleSort('std')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Std Dev
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="p-3 text-right font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleSort('min')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Min
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="p-3 text-right font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleSort('max')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Max
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="p-3 text-right font-medium">P25</th>
                      <th className="p-3 text-right font-medium">P75</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedVariables.map((variable) => {
                      const varData = data.historical_data[variable];
                      const unit = data.metadata.units[variable] || '';
                      return (
                        <tr key={variable} className="border-b hover:bg-muted/50 transition-colors">
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
                          <td className="p-3 text-right">
                            {varData.statistics.percentile_25.toFixed(2)} {unit}
                          </td>
                          <td className="p-3 text-right">
                            {varData.statistics.percentile_75.toFixed(2)} {unit}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </CardContent>
        )}
      </Card>

      
    </div>
  );
}
