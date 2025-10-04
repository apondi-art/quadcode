import { WeatherQueryResponse } from '@/types/weather';

/**
 * Export weather data to CSV format
 */
export function exportToCSV(data: WeatherQueryResponse): string {
  const lines: string[] = [];

  // Add header information
  lines.push(`Location: ${data.query_info.requested_location.name}`);
  lines.push(`Day of Year: ${data.query_info.day_of_year}`);
  lines.push(`Years Analyzed: ${data.query_info.years_analyzed}`);
  lines.push(`Data Period: ${data.query_info.data_period}`);
  lines.push('');

  // Add statistics table
  lines.push('Variable,Mean,Median,Std Dev,Min,Max,P25,P75,Count');
  Object.entries(data.historical_data).forEach(([variable, varData]) => {
    const stats = varData.statistics;
    const count = 'count' in stats ? stats.count : varData.values.length;
    lines.push(
      `${variable},${stats.mean},${stats.median},${stats.std},${stats.min},${stats.max},${stats.percentile_25},${stats.percentile_75},${count}`
    );
  });

  lines.push('');
  lines.push('Historical Values');

  // Add historical values for each variable
  Object.entries(data.historical_data).forEach(([variable, varData]) => {
    lines.push('');
    lines.push(`${variable} (${data.metadata.units[variable] || ''})`);
    lines.push('Year,Value');
    varData.years.forEach((year, index) => {
      lines.push(`${year},${varData.values[index]}`);
    });
  });

  // Add probabilities
  lines.push('');
  lines.push('Threshold Probabilities');
  lines.push('Variable,Threshold,Probability');
  Object.entries(data.historical_data).forEach(([variable, varData]) => {
    Object.entries(varData.probabilities).forEach(([threshold, probability]) => {
      lines.push(`${variable},${threshold},${probability}`);
    });
  });

  return lines.join('\n');
}

/**
 * Export weather data to JSON format
 */
export function exportToJSON(data: WeatherQueryResponse): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Download a file with the given content
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename based on location and date
 */
export function generateFilename(data: WeatherQueryResponse, format: 'csv' | 'json'): string {
  const location = data.query_info.requested_location.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'location';
  const date = data.query_info.day_of_year.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const timestamp = new Date().toISOString().split('T')[0];
  return `weather_data_${location}_${date}_${timestamp}.${format}`;
}
