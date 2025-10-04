# Weather Probability Explorer - Frontend

A Next.js TypeScript frontend for visualizing historical weather probabilities using NASA EarthData.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Maps**: Leaflet + React Leaflet

## Features

### 📍 Location Selection
- Interactive map with click-to-select location
- Autocomplete search using OpenStreetMap Nominatim
- Manual coordinate input

### 📅 Date Selection
- Month dropdown selector
- Day slider with visual feedback
- Automatic validation for days per month

### 🌤️ Weather Variables
- Temperature (°C)
- Precipitation (mm)
- Wind Speed (m/s)
- Humidity (%)

### ⚙️ Threshold Settings
- Customizable thresholds for extreme conditions
- Sliders for easy adjustment
- Dynamic display based on selected variables

### 📊 Visualizations
- **Summary Cards**: Location info, probability metrics, trends
- **Probability Distribution**: Histogram showing likelihood of different values
- **Time Series**: Historical values across years
- **Statistics Table**: Raw data with mean, median, min, max, std dev
- **Insights Panel**: AI-generated summaries

### 💾 Data Export
- Download results as CSV
- Includes all historical data points

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (default: http://localhost:8000)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.local.example .env.local
```

3. Configure API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Component Structure

```
src/
├── app/
│   ├── page.tsx              # Main dashboard page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── LocationSelector.tsx  # Location search + map
│   ├── MapComponent.tsx      # Leaflet map
│   ├── DayOfYearPicker.tsx   # Date selection
│   ├── VariableSelector.tsx  # Weather variable checkboxes
│   ├── ThresholdSettings.tsx # Threshold sliders
│   ├── StatisticsCards.tsx   # Summary metrics
│   ├── ProbabilityChart.tsx  # Distribution histogram
│   ├── TimeSeriesChart.tsx   # Historical line chart
│   └── ResultsVisualization.tsx # Main results container
├── services/
│   └── api.ts                # API client
└── types/
    └── weather.ts            # TypeScript interfaces
```

## API Integration

The frontend communicates with the FastAPI backend via the following endpoints:

- `POST /api/v1/weather/query` - Fetch weather data
- `GET /api/v1/weather/variables` - Get available variables
- `POST /api/v1/weather/download` - Download data
- `GET /api/v1/health` - Health check

See `src/services/api.ts` for implementation details.

## Customization

### Theme

The app uses shadcn/ui theming. Customize colors in `src/app/globals.css`:

```css
:root {
  --primary: oklch(...);
  --secondary: oklch(...);
  /* etc */
}
```

### Default Values

Edit initial state in `src/app/page.tsx`:

```typescript
const [location, setLocation] = useState<Location>({
  lat: -0.4197,
  lon: 36.9489,
  name: 'Nyeri, Kenya',
});

const [dayOfYear, setDayOfYear] = useState<DayOfYear>({
  month: 8,
  day: 3,
});
```

## Troubleshooting

### Map not loading
- Check that Leaflet CSS is properly imported
- Ensure dynamic import is used to avoid SSR issues

### CORS errors
- Verify backend CORS settings allow `http://localhost:3000`
- Check API URL in `.env.local`

### Type errors
- Run `npm run build` to check for TypeScript errors
- Ensure all types are properly defined in `src/types/weather.ts`

## License

Part of the NASA Space Apps Challenge project.
