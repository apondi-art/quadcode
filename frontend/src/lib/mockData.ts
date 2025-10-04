// Mock data from data.json
import mockDataJson from '../../data.json';
import { WeatherQueryResponse } from '@/types/weather';

// Export the mock data as a typed response
export const getMockWeatherData = (): WeatherQueryResponse => {
  return mockDataJson as WeatherQueryResponse;
};

// Legacy generators for charts (kept for backward compatibility)
export const generateProbabilityDistributionData = () => {
  const data = [];
  // Generate bell curve data
  const mean = 25;
  const stdDev = 8;

  for (let i = 0; i <= 50; i++) {
    const x = i;
    const probability = (100 / (stdDev * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    data.push({
      value: x,
      probability: probability * 10, // Scale for visibility
    });
  }

  return data;
};

export const generateHistoricalTimeSeriesData = () => {
  return [
    { year: 2019, temperature: 24.5, precipitation: 45.2, humidity: 68 },
    { year: 2020, temperature: 25.1, precipitation: 52.8, humidity: 72 },
    { year: 2021, temperature: 23.8, precipitation: 38.5, humidity: 65 },
    { year: 2022, temperature: 26.2, precipitation: 48.9, humidity: 70 },
    { year: 2023, temperature: 25.9, precipitation: 55.3, humidity: 74 },
    { year: 2024, temperature: 27.1, precipitation: 42.1, humidity: 66 },
  ];
};

export const generateRadarChartData = () => {
  return [
    { variable: 'Temperature', value: 78, fullMark: 100 },
    { variable: 'Precipitation', value: 65, fullMark: 100 },
    { variable: 'Humidity', value: 82, fullMark: 100 },
    { variable: 'Wind Speed', value: 45, fullMark: 100 },
    { variable: 'Cloud Cover', value: 58, fullMark: 100 },
    { variable: 'Pressure', value: 72, fullMark: 100 },
  ];
};

export const generateHeatmapCalendarData = () => {
  const data: Array<{ month: string; day: number; value: number }> = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  months.forEach((month, monthIndex) => {
    for (let day = 1; day <= daysPerMonth[monthIndex]; day++) {
      // Generate some pattern - higher values in summer months
      // Use deterministic pattern based on month and day to avoid hydration mismatch
      const baseValue = monthIndex >= 5 && monthIndex <= 8 ? 60 : 30;
      const variation = ((monthIndex * 31 + day) % 30) - 15;
      data.push({
        month,
        day,
        value: Math.max(0, Math.min(100, baseValue + variation)),
      });
    }
  });

  return data;
};

export const generateSummaryData = () => {
  return {
    location: 'Nyeri, Kenya',
    bestConditionPercentage: 72,
    extremeAlerts: 8,
    historicalTrend: 'up' as const,
  };
};
