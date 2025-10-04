'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HeatmapCalendarProps {
  data: Array<{
    month: string;
    day: number;
    value: number;
  }>;
  title?: string;
  description?: string;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function HeatmapCalendar({
  data,
  title = 'Monthly Pattern Heatmap',
  description = 'Historical patterns across the year',
}: HeatmapCalendarProps) {
  // Get intensity color based on value (0-100)
  const getColor = (value: number) => {
    if (value < 20) return 'bg-blue-200 dark:bg-blue-900/40';
    if (value < 40) return 'bg-blue-400 dark:bg-blue-700/60';
    if (value < 60) return 'bg-orange-400 dark:bg-orange-600/60';
    if (value < 80) return 'bg-orange-500 dark:bg-orange-500/70';
    return 'bg-red-500 dark:bg-red-500/80';
  };

  // Group data by month
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.month]) {
      acc[item.month] = [];
    }
    acc[item.month].push(item);
    return acc;
  }, {} as Record<string, typeof data>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {months.map((month) => {
            const monthData = groupedData[month] || [];
            const daysInMonth = monthData.length > 0 ? Math.max(...monthData.map(d => d.day)) : 31;

            return (
              <div key={month} className="flex items-center gap-2">
                <div className="w-12 text-xs font-medium text-muted-foreground">{month}</div>
                <div className="flex-1 flex gap-1">
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const dayData = monthData.find(d => d.day === i + 1);
                    const value = dayData?.value ?? 0;

                    return (
                      <div
                        key={i}
                        className={`flex-1 h-6 rounded-sm transition-all hover:scale-110 hover:shadow-md cursor-pointer ${getColor(value)}`}
                        title={`${month} ${i + 1}: ${value.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs">
          <span className="text-muted-foreground">Less</span>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded-sm bg-blue-200 dark:bg-blue-900/40" />
            <div className="w-6 h-6 rounded-sm bg-blue-400 dark:bg-blue-700/60" />
            <div className="w-6 h-6 rounded-sm bg-orange-400 dark:bg-orange-600/60" />
            <div className="w-6 h-6 rounded-sm bg-orange-500 dark:bg-orange-500/70" />
            <div className="w-6 h-6 rounded-sm bg-red-500 dark:bg-red-500/80" />
          </div>
          <span className="text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
}
