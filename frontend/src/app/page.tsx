'use client';

import { useState } from 'react';
import LocationSelector from '@/components/LocationSelector';
import DayOfYearPicker from '@/components/DayOfYearPicker';
import VariableSelector from '@/components/VariableSelector';
import ThresholdSettings from '@/components/ThresholdSettings';
import ResultsVisualization from '@/components/ResultsVisualization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WeatherAPI } from '@/services/api';
import { Location, DayOfYear, Thresholds, WeatherQueryResponse } from '@/types/weather';
import { Download, Loader2 } from 'lucide-react';

export default function Home() {
  const [location, setLocation] = useState<Location>({
    lat: -0.4197,
    lon: 36.9489,
    name: 'Nyeri, Kenya',
  });

  const [dayOfYear, setDayOfYear] = useState<DayOfYear>({
    month: 8,
    day: 3,
  });

  const [selectedVariables, setSelectedVariables] = useState<string[]>(['temperature', 'precipitation']);

  const [thresholds, setThresholds] = useState<Thresholds>({
    temperature: { hot: 35, cold: 5 },
    precipitation: { wet: 50 },
    wind_speed: { windy: 40 },
    humidity: { high: 80, low: 20 },
  });

  const [results, setResults] = useState<WeatherQueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (selectedVariables.length === 0) {
      setError('Please select at least one weather variable');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await WeatherAPI.queryWeather({
        location,
        day_of_year: dayOfYear,
        historical_years: {
          start_year: 2019,
          end_year: 2024,
        },
        variables: selectedVariables,
        thresholds,
      });

      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLocation({ lat: -0.4197, lon: 36.9489, name: 'Nyeri, Kenya' });
    setDayOfYear({ month: 8, day: 3 });
    setSelectedVariables(['temperature', 'precipitation']);
    setThresholds({
      temperature: { hot: 35, cold: 5 },
      precipitation: { wet: 50 },
      wind_speed: { windy: 40 },
      humidity: { high: 80, low: 20 },
    });
    setResults(null);
    setError(null);
  };

  const handleDownload = async (format: 'csv' | 'json') => {
    if (!results) return;

    try {
      const blob = await WeatherAPI.downloadData(
        {
          location,
          day_of_year: dayOfYear,
          historical_years: { start_year: 2019, end_year: 2024 },
          variables: selectedVariables,
          thresholds,
        },
        format
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather-data-${location.lat}-${location.lon}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Weather Probability Explorer</h1>
            <p className="text-muted-foreground text-lg">
              Historical weather probabilities for any location, any day
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* Query Panel - Left Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Query Parameters</CardTitle>
                <CardDescription>Configure your weather analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">Location</h3>
                  <LocationSelector location={location} onLocationChange={setLocation} />
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-4">Date Selection</h3>
                  <DayOfYearPicker dayOfYear={dayOfYear} onDayOfYearChange={setDayOfYear} />
                </div>
              </CardContent>
            </Card>

            <VariableSelector
              selectedVariables={selectedVariables}
              onVariablesChange={setSelectedVariables}
            />

            <ThresholdSettings
              selectedVariables={selectedVariables}
              thresholds={thresholds}
              onThresholdsChange={setThresholds}
            />

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full" size="lg" onClick={handleAnalyze} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Weather'
                  )}
                </Button>
                <Button className="w-full" variant="outline" onClick={handleReset}>
                  Reset Filters
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleDownload('csv')}
                  disabled={!results}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </CardContent>
            </Card>

            {error && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <p className="text-sm text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Results Panel - Right Section */}
          <section>
            <ResultsVisualization data={results} loading={loading} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Powered by NASA EarthData | GPM IMERG & MERRA-2
          </p>
        </div>
      </footer>
    </div>
  );
}
