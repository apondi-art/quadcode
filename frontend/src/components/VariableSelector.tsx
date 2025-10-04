'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Variable {
  id: string;
  name: string;
  description: string;
  unit: string;
}

const AVAILABLE_VARIABLES: Variable[] = [
  { id: 'temperature', name: 'Temperature', description: '2-meter air temperature', unit: '°C' },
  { id: 'precipitation', name: 'Precipitation', description: 'Daily rainfall amount', unit: 'mm' },
  { id: 'wind_speed', name: 'Wind Speed', description: '2-meter wind speed', unit: 'm/s' },
  { id: 'humidity', name: 'Humidity', description: 'Relative humidity', unit: '%' },
];

interface VariableSelectorProps {
  selectedVariables: string[];
  onVariablesChange: (variables: string[]) => void;
}

export default function VariableSelector({
  selectedVariables,
  onVariablesChange,
}: VariableSelectorProps) {
  const handleToggle = (variableId: string) => {
    if (selectedVariables.includes(variableId)) {
      onVariablesChange(selectedVariables.filter((v) => v !== variableId));
    } else {
      onVariablesChange([...selectedVariables, variableId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Variables</CardTitle>
        <CardDescription>Select the weather parameters to analyze</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {AVAILABLE_VARIABLES.map((variable) => (
          <div key={variable.id} className="flex items-start space-x-3 space-y-0">
            <Checkbox
              id={variable.id}
              checked={selectedVariables.includes(variable.id)}
              onCheckedChange={() => handleToggle(variable.id)}
            />
            <div className="flex-1 leading-none">
              <Label
                htmlFor={variable.id}
                className="text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                {variable.name}
                <span className="text-xs text-muted-foreground">({variable.unit})</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">{variable.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
