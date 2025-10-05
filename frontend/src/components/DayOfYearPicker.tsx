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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
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
  const [isOpen, setIsOpen] = React.useState(false);

  const currentMonth = MONTHS.find((m) => m.value === dayOfYear.month) || MONTHS[0];
  const maxDays = currentMonth.days;

  // Ensure day is within valid range when month changes
  const handleMonthChange = (monthValue: string) => {
    const newMonth = parseInt(monthValue);
    const newMonthData = MONTHS.find((m) => m.value === newMonth) || MONTHS[0];
    const newDay = Math.min(dayOfYear.day, newMonthData.days);
    onDayOfYearChange({ month: newMonth, day: newDay });
  };

  const handleDayClick = (day: number) => {
    onDayOfYearChange({ ...dayOfYear, day });
    setIsOpen(false); // Close the popover after selection
  };

  // Generate years (current year + 10 years)
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = () => {
    // Use a leap year to handle Feb 29
    const date = new Date(2024, dayOfYear.month - 1, 1);
    return date.getDay();
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth();
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= maxDays; i++) {
      days.push(i);
    }

    return days;
  };

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

      <div className="space-y-2">
        <Label>Day</Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-left font-normal"
            >
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dayOfYear.day ? (
                  <>
                    {currentMonth.label} {dayOfYear.day}
                    {dayOfYear.day === 1 || dayOfYear.day === 21 || dayOfYear.day === 31 ? 'st' :
                     dayOfYear.day === 2 || dayOfYear.day === 22 ? 'nd' :
                     dayOfYear.day === 3 || dayOfYear.day === 23 ? 'rd' : 'th'}
                  </>
                ) : (
                  <span>Pick a day</span>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <div className="space-y-3">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-xs font-medium text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && handleDayClick(day)}
                    disabled={!day}
                    className={`
                      aspect-square w-9 rounded-md text-sm font-medium transition-all
                      ${!day ? 'invisible' : ''}
                      ${day === dayOfYear.day
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-accent hover:text-accent-foreground'
                      }
                      disabled:cursor-default
                    `}
                    type="button"
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Selected Date</p>
          <p className="text-2xl font-bold text-foreground">
            {currentMonth.label} {dayOfYear.day}
          </p>
          <p className="text-sm text-muted-foreground font-medium">{selectedYear}</p>
        </div>
      </div>
    </div>
  );
}
