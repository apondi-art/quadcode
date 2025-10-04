'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { DayOfYear } from '@/types/weather';

interface DayOfYearPickerProps {
  dayOfYear: DayOfYear;
  onDayOfYearChange: (dayOfYear: DayOfYear) => void;
}

const MONTHS = [
  { value: 1, label: 'January', days: 31 },
  { value: 2, label: 'February', days: 29 },
  { value: 3, label: 'March', days: 31 },
  { value: 4, label: 'April', days: 30 },
  { value: 5, label: 'May', days: 31 },
  { value: 6, label: 'June', days: 30 },
  { value: 7, label: 'July', days: 31 },
  { value: 8, label: 'August', days: 31 },
  { value: 9, label: 'September', days: 30 },
  { value: 10, label: 'October', days: 31 },
  { value: 11, label: 'November', days: 30 },
  { value: 12, label: 'December', days: 31 },
];

export default function DayOfYearPicker({ dayOfYear, onDayOfYearChange }: DayOfYearPickerProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(currentYear + 1);

  const currentMonth = MONTHS.find((m) => m.value === dayOfYear.month) || MONTHS[0];
  const maxDays = currentMonth.days;

  // Ensure day is within valid range when month changes
  const handleMonthChange = (monthValue: string) => {
    const newMonth = parseInt(monthValue);
    const newMonthData = MONTHS.find((m) => m.value === newMonth) || MONTHS[0];
    const newDay = Math.min(dayOfYear.day, newMonthData.days);
    onDayOfYearChange({ month: newMonth, day: newDay });
  };

  const handleDayChange = (value: number[]) => {
    onDayOfYearChange({ ...dayOfYear, day: value[0] });
  };

  // Generate years (current year + 10 years)
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="year-select">Year</Label>
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
          <SelectTrigger id="year-select">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="month-select">Month</Label>
        <Select value={dayOfYear.month.toString()} onValueChange={handleMonthChange}>
          <SelectTrigger id="month-select">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="day-slider">Day</Label>
          <span className="text-2xl font-bold text-primary">{dayOfYear.day}</span>
        </div>
        <Slider
          id="day-slider"
          min={1}
          max={maxDays}
          step={1}
          value={[dayOfYear.day]}
          onValueChange={handleDayChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>{maxDays}</span>
        </div>
      </div>

      <div className="p-3 bg-muted rounded-md text-center">
        <p className="text-sm font-medium">
          Selected Date: {currentMonth.label} {dayOfYear.day}, {selectedYear}
        </p>
      </div>
    </div>
  );
}
