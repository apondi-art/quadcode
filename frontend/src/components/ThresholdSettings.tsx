'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        <CardTitle className="text-primary">Threshold Settings</CardTitle>
        <CardDescription>Define thresholds for extreme conditions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedVariables.includes('temperature') && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Temperature Thresholds</h4>
            <div className="space-y-3">
               <div className="space-y-2">
                 <Label className="text-xs">Very Hot (&gt;)</Label>
                 <Select
                   value={String(thresholds.temperature?.hot || 35)}
                   onValueChange={(val) => updateThreshold('temperature', 'hot', Number(val))}
                 >
                   <SelectTrigger className="w-full">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     {Array.from({ length: 21 }, (_, i) => 25 + i).map((val) => (
                       <SelectItem key={val} value={String(val)}>
                         {val}°C
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label className="text-xs">Very Cold (&lt;)</Label>
                 <Select
                   value={String(thresholds.temperature?.cold || 5)}
                   onValueChange={(val) => updateThreshold('temperature', 'cold', Number(val))}
                 >
                   <SelectTrigger className="w-full">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     {Array.from({ length: 26 }, (_, i) => -10 + i).map((val) => (
                       <SelectItem key={val} value={String(val)}>
                         {val}°C
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
            </div>
          </div>
        )}

        {selectedVariables.includes('precipitation') && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Precipitation Thresholds</h4>
             <div className="space-y-2">
               <Label className="text-xs">Very Wet (&gt;)</Label>
               <Select
                 value={String(thresholds.precipitation?.wet || 50)}
                 onValueChange={(val) => updateThreshold('precipitation', 'wet', Number(val))}
               >
                 <SelectTrigger className="w-full">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {Array.from({ length: 20 }, (_, i) => 10 + i * 10).map((val) => (
                     <SelectItem key={val} value={String(val)}>
                       {val} mm
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>
        )}

        {selectedVariables.includes('wind_speed') && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Wind Speed Thresholds</h4>
             <div className="space-y-2">
               <Label className="text-xs">Very Windy (&gt;)</Label>
               <Select
                 value={String(thresholds.wind_speed?.windy || 40)}
                 onValueChange={(val) => updateThreshold('wind_speed', 'windy', Number(val))}
               >
                 <SelectTrigger className="w-full">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {Array.from({ length: 19 }, (_, i) => 10 + i * 5).map((val) => (
                     <SelectItem key={val} value={String(val)}>
                       {val} m/s
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>
        )}

        {selectedVariables.includes('humidity') && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Humidity Thresholds</h4>
            <div className="space-y-3">
               <div className="space-y-2">
                 <Label className="text-xs">Very High (&gt;)</Label>
                 <Select
                   value={String(thresholds.humidity?.high || 80)}
                   onValueChange={(val) => updateThreshold('humidity', 'high', Number(val))}
                 >
                   <SelectTrigger className="w-full">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     {Array.from({ length: 9 }, (_, i) => 60 + i * 5).map((val) => (
                       <SelectItem key={val} value={String(val)}>
                         {val}%
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label className="text-xs">Very Low (&lt;)</Label>
                 <Select
                   value={String(thresholds.humidity?.low || 20)}
                   onValueChange={(val) => updateThreshold('humidity', 'low', Number(val))}
                 >
                   <SelectTrigger className="w-full">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     {Array.from({ length: 9 }, (_, i) => i * 5).map((val) => (
                       <SelectItem key={val} value={String(val)}>
                         {val}%
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
