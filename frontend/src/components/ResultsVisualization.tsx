'use client';

import React, { useState } from 'react';
import { WeatherQueryResponse } from '@/types/weather';
import StatisticsCards from './StatisticsCards';
import ProbabilityChart from './ProbabilityChart';
import TimeSeriesChart from './TimeSeriesChart';
import TrendAnalysisChart from './TrendAnalysisChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown, ChevronUp, ArrowUpDown, Loader2 } from 'lucide-react';
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
      <div className="space-y-4">
        {/* Loading Weather Forecast Summary */}
        <Card className="border-l-4 border-primary bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              Weather Forecast Summary
            </CardTitle>
            <CardDescription className="text-xs">Analyzing historical data...</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-2 bg-card rounded-lg border animate-pulse">
                <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Loading Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </Card>
          ))}
        </div>
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
    <div className="space-y-4">
      {/* Download Buttons */}
      <div className="flex gap-2 justify-end">
        <Button onClick={() => handleDownload('csv')} variant="outline" size="sm">
          <Download className="mr-1 h-3 w-3" />
          CSV
        </Button>
        <Button onClick={() => handleDownload('json')} variant="outline" size="sm">
          <Download className="mr-1 h-3 w-3" />
          JSON
        </Button>
      </div>

      {/* Prediction Summary & Summary Cards - Stacked vertically */}
      <div className="space-y-4">
        {/* Prediction Summary */}
        <Card className="border-l-4 border-primary bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary">Weather Forecast Summary</CardTitle>
            <CardDescription className="text-xs">{data.query_info.day_of_year} Prediction</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {variables.map((variable) => {
              const varData = data.historical_data[variable];
              const variableName = variable.charAt(0).toUpperCase() + variable.slice(1).replace('_', ' ');
              const unit = data.metadata.units[variable] || '';
              const trend = varData.statistics.trend;
              const mean = varData.statistics.mean;

              let prediction = '';
              if (variable === 'precipitation' && mean > 10) {
                prediction = 'will be wet';
              } else if (variable === 'precipitation' && mean < 1) {
                prediction = 'will be dry';
              } else if (variable === 'temperature' && mean > 30) {
                prediction = 'will be very hot';
              } else if (variable === 'temperature' && mean < 10) {
                prediction = 'will be cold';
              } else if (variable === 'wind_speed' && mean > 15) {
                prediction = 'will be windy';
              } else if (variable === 'humidity' && mean > 80) {
                prediction = 'will be humid';
              } else {
                prediction = `will have moderate ${variableName.toLowerCase()}`;
              }

              // Determine border color and background based on variable & value
              let borderColor = 'border-l-primary';
              let bgColor = 'bg-card';

              if (variable === 'temperature') {
                borderColor = 'border-l-accent';
                // Hot = warm tint, Cold = cool tint
                if (mean > 30) bgColor = 'bg-accent/10';
                else if (mean < 10) bgColor = 'bg-primary/10';
              } else if (variable === 'precipitation') {
                borderColor = 'border-l-secondary';
                // Wet = blue tint, Dry = neutral
                if (mean > 10) bgColor = 'bg-secondary/10';
              } else if (variable === 'humidity') {
                borderColor = 'border-l-chart-3';
                if (mean > 80) bgColor = 'bg-chart-3/10';
              } else if (variable === 'wind_speed') {
                borderColor = 'border-l-chart-4';
                if (mean > 15) bgColor = 'bg-chart-4/10';
              }

              // Get icon based on variable and condition
              let icon = '';
              if (variable === 'temperature') {
                icon = mean > 30 ? '🌡️' : mean < 10 ? '❄️' : '🌤️';
              } else if (variable === 'precipitation') {
                icon = mean > 10 ? '🌧️' : mean < 1 ? '☀️' : '⛅';
              } else if (variable === 'humidity') {
                icon = mean > 80 ? '💧' : '💨';
              } else if (variable === 'wind_speed') {
                icon = mean > 15 ? '💨' : '🍃';
              }

              return (
                <div key={variable} className={`p-2 rounded-lg border-l-4 ${borderColor} ${bgColor} hover:shadow-md transition-all`}>
                  <p className="text-sm font-semibold flex items-center gap-1">
                    <span>{icon}</span>
                    {data.query_info.day_of_year} {prediction}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expected: {mean.toFixed(1)} {unit}
                    {trend && trend.trend_direction && (
                      <span className={`ml-2 font-medium ${
                        trend.trend_direction === 'increasing'
                          ? 'text-accent'
                          : trend.trend_direction === 'decreasing'
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}>
                        • {trend.trend_direction === 'increasing' ? '↗' : trend.trend_direction === 'decreasing' ? '↘' : '→'}
                        {' '}{Math.abs(trend.percent_change || 0).toFixed(1)}% {trend.trend_direction}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Summary Cards - Grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatisticsCards data={data} />
        </div>
      </div>

      {/* Row 1: Trend + Probability Charts - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variables.map((variable) => {
          const varData = data.historical_data[variable];
          const unit = data.metadata.units[variable] || '';
          const variableName = variable.charAt(0).toUpperCase() + variable.slice(1).replace('_', ' ');

          return (
            <React.Fragment key={`trend-prob-${variable}`}>
              <TrendAnalysisChart
                variableName={variableName}
                data={varData}
                unit={unit}
              />
              <ProbabilityChart
                variableName={variableName}
                data={varData}
                unit={unit}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* Row 2: Time Series + Raw Statistics - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Series Charts */}
        {variables.map((variable) => {
          const varData = data.historical_data[variable];
          const unit = data.metadata.units[variable] || '';
          const variableName = variable.charAt(0).toUpperCase() + variable.slice(1).replace('_', ' ');

          return (
            <TimeSeriesChart
              key={`timeseries-${variable}`}
              variableName={variableName}
              data={varData}
              unit={unit}
            />
          );
        })}

        {/* Expandable Sortable Data Table */}
        <Card>
          <CardHeader className="cursor-pointer pb-3" onClick={() => setIsTableExpanded(!isTableExpanded)}>
            <CardTitle className="flex items-center gap-2 text-base">
              Raw Statistics
              {isTableExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CardTitle>
            <CardDescription className="text-xs">
              {isTableExpanded ? 'Click to collapse' : 'Click to expand'}
            </CardDescription>
          </CardHeader>
          {isTableExpanded && (
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium cursor-pointer" onClick={() => handleSort('variable')}>
                        <div className="flex items-center gap-1">
                          Var
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="p-2 text-right font-medium cursor-pointer" onClick={() => handleSort('mean')}>
                        <div className="flex items-center justify-end gap-1">
                          Mean
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="p-2 text-right font-medium cursor-pointer" onClick={() => handleSort('std')}>Std</th>
                      <th className="p-2 text-right font-medium cursor-pointer" onClick={() => handleSort('min')}>Min</th>
                      <th className="p-2 text-right font-medium cursor-pointer" onClick={() => handleSort('max')}>Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedVariables.map((variable) => {
                      const varData = data.historical_data[variable];
                      const unit = data.metadata.units[variable] || '';
                      return (
                        <tr key={variable} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">
                            {variable.charAt(0).toUpperCase() + variable.slice(1).replace('_', ' ')}
                          </td>
                          <td className="p-2 text-right">{varData.statistics.mean.toFixed(1)}</td>
                          <td className="p-2 text-right">{varData.statistics.std.toFixed(1)}</td>
                          <td className="p-2 text-right">{varData.statistics.min.toFixed(1)}</td>
                          <td className="p-2 text-right">{varData.statistics.max.toFixed(1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Row 3: Understanding Metrics - Full width */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Understanding the Metrics</CardTitle>
          <CardDescription className="text-xs">Parameter definitions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="border-l-4 border-primary pl-3 py-2 hover:bg-primary/5 transition-colors">
              <p className="font-semibold text-primary">Mean</p>
              <p className="text-muted-foreground">Typical value (average)</p>
            </div>
            <div className="border-l-4 border-warning pl-3 py-2 hover:bg-warning/5 transition-colors">
              <p className="font-semibold text-warning">Std Dev</p>
              <p className="text-muted-foreground">Measure of variability</p>
            </div>
            <div className="border-l-4 border-accent pl-3 py-2 hover:bg-accent/5 transition-colors">
              <p className="font-semibold text-accent">Min/Max</p>
              <p className="text-muted-foreground">Historical range</p>
            </div>
            <div className="border-l-4 border-secondary pl-3 py-2 hover:bg-secondary/5 transition-colors">
              <p className="font-semibold text-secondary">Trend</p>
              <p className="text-muted-foreground">Linear regression (R² = correlation strength)</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
