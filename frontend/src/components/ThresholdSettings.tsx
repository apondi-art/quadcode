'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Thresholds } from '@/types/weather';

interface ThresholdSettingsProps {
  selectedVariables: string[];
  thresholds: Thresholds;
  onThresholdsChange: (thresholds: Thresholds) => void;
}

export default function ThresholdSettings({
  selectedVariables,
  thresholds,
  onThresholdsChange,
}: ThresholdSettingsProps) {
  const updateThreshold = (variable: string, key: string, value: number) => {
    onThresholdsChange({
      ...thresholds,
      [variable]: {
        ...thresholds[variable as keyof Thresholds],
        [key]: value,
      },
    });
  };

  if (selectedVariables.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threshold Settings</CardTitle>
        <CardDescription>Define thresholds for extreme conditions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedVariables.includes('temperature') && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Temperature Thresholds</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Very Hot (&gt;)</Label>
                  <span className="text-xs font-medium">{thresholds.temperature?.hot || 35}°C</span>
                </div>
                <Slider
                  min={25}
                  max={45}
                  step={1}
                  value={[thresholds.temperature?.hot || 35]}
                  onValueChange={(val) => updateThreshold('temperature', 'hot', val[0])}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Very Cold (&lt;)</Label>
                  <span className="text-xs font-medium">{thresholds.temperature?.cold || 5}°C</span>
                </div>
                <Slider
                  min={-10}
                  max={15}
                  step={1}
                  value={[thresholds.temperature?.cold || 5]}
                  onValueChange={(val) => updateThreshold('temperature', 'cold', val[0])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {selectedVariables.includes('precipitation') && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Precipitation Thresholds</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Very Wet (&gt;)</Label>
                <span className="text-xs font-medium">{thresholds.precipitation?.wet || 50} mm</span>
              </div>
              <Slider
                min={10}
                max={200}
                step={10}
                value={[thresholds.precipitation?.wet || 50]}
                onValueChange={(val) => updateThreshold('precipitation', 'wet', val[0])}
                className="w-full"
              />
            </div>
          </div>
        )}

        {selectedVariables.includes('wind_speed') && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Wind Speed Thresholds</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Very Windy (&gt;)</Label>
                <span className="text-xs font-medium">{thresholds.wind_speed?.windy || 40} m/s</span>
              </div>
              <Slider
                min={10}
                max={100}
                step={5}
                value={[thresholds.wind_speed?.windy || 40]}
                onValueChange={(val) => updateThreshold('wind_speed', 'windy', val[0])}
                className="w-full"
              />
            </div>
          </div>
        )}

        {selectedVariables.includes('humidity') && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Humidity Thresholds</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Very High (&gt;)</Label>
                  <span className="text-xs font-medium">{thresholds.humidity?.high || 80}%</span>
                </div>
                <Slider
                  min={60}
                  max={100}
                  step={5}
                  value={[thresholds.humidity?.high || 80]}
                  onValueChange={(val) => updateThreshold('humidity', 'high', val[0])}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-xs">Very Low (&lt;)</Label>
                  <span className="text-xs font-medium">{thresholds.humidity?.low || 20}%</span>
                </div>
                <Slider
                  min={0}
                  max={40}
                  step={5}
                  value={[thresholds.humidity?.low || 20]}
                  onValueChange={(val) => updateThreshold('humidity', 'low', val[0])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
