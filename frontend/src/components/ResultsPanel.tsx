'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import SummaryCards from '@/components/SummaryCards';
import ProbabilityDistributionChart from '@/components/ProbabilityDistributionChart';
import HistoricalTimeSeriesChart from '@/components/HistoricalTimeSeriesChart';
import RadarChart from '@/components/RadarChart';
import HeatmapCalendar from '@/components/HeatmapCalendar';
import {
  generateProbabilityDistributionData,
  generateHistoricalTimeSeriesData,
  generateRadarChartData,
  generateHeatmapCalendarData,
  generateSummaryData,
} from '@/lib/mockData';

interface ResultsPanelProps {
  loading?: boolean;
}

export default function ResultsPanel({ loading = false }: ResultsPanelProps) {
  // Generate mock data
  const summaryData = generateSummaryData();
  const probabilityData = generateProbabilityDistributionData();
  const timeSeriesData = generateHistoricalTimeSeriesData();
  const radarData = generateRadarChartData();
  const heatmapData = generateHeatmapCalendarData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-6 pr-4">
        {/* Summary Cards */}
        <section>
          <SummaryCards
            location={summaryData.location}
            bestConditionPercentage={summaryData.bestConditionPercentage}
            extremeAlerts={summaryData.extremeAlerts}
            historicalTrend={summaryData.historicalTrend}
          />
        </section>

        {/* Probability Distribution Chart */}
        <section>
          <ProbabilityDistributionChart
            data={probabilityData}
            threshold={30}
            title="Probability Distribution"
            description="Bell curve showing historical temperature patterns with threshold"
          />
        </section>

        {/* Historical Time Series */}
        <section>
          <HistoricalTimeSeriesChart
            data={timeSeriesData}
            title="Historical Trends (2019-2024)"
            description="Multi-year weather variable trends"
          />
        </section>

        {/* Radar Chart */}
        <section>
          <RadarChart
            data={radarData}
            title="Multi-Variable Analysis"
            description="Comparative analysis across weather variables"
          />
        </section>

        {/* Heatmap Calendar */}
        <section>
          <HeatmapCalendar
            data={heatmapData}
            title="Annual Pattern Heatmap"
            description="Daily patterns showing seasonal variations"
          />
        </section>
      </div>
    </ScrollArea>
  );
}
