# NASA Space Apps Weather Probability Dashboard
## Complete Technical Specification

---

## 1. FRONTEND DESIGN & USER INTERFACE

### 1.1 Landing Page / Hero Section
**Visual Design:**
- Hero text: "Plan Your Perfect Day" with tagline "Historical weather probabilities for any location, any day"
- Call-to-action button: "Explore Weather Data" (Neon Yellow accent)

### 1.2 Main Dashboard Layout

#### Header Section
- App logo (motif/small version for compact header)
- App title: "Weather Probability Explorer"
- Navigation: Dashboard | About | Data Sources

#### Query Panel (Left Sidebar - 30% width)
**Location Input:**
- Search bar with autocomplete
  - Placeholder: "Enter location (e.g., Nairobi, Kenya)"
  - Dropdown showing predicted matches as user types
  - Each suggestion shows: City, Region, Country
- Interactive map below search (using Leaflet/Mapbox)
  - Users can click/drop pin on map
  - Selected location highlighted with marker
  - Map style: Dark theme matching brand colors

**Date Selection:**
- Month dropdown (January - December)
- Day slider (1-31) with visual day-of-year indicator

**Weather Variables (Multi-select checkboxes):**
- Temperature (°C/°F toggle)
- Precipitation (mm)
- Wind Speed (km/h or mph)
- Humidity (%)

**Threshold Settings:**
- For each selected variable, expandable settings:
  - "Very Hot": Slider for temperature threshold (default: >35°C)
  - "Very Cold": Slider (default: <5°C)
  - "Very Wet": Slider for precipitation (default: >50mm)
  - "Very Windy": Slider for wind speed (default: >40 km/h)
  - "Very Uncomfortable": Combination of 2 or more variables
  - Custom thresholds with color indicators

**Action Buttons:**
- "Analyze Weather" (Primary button)
- "Reset Filters" (Secondary button)
- "Download Data" (Icon button - disabled until results load)

#### Main Results Panel (Right Section - 70% width)

**Summary Cards (Top Row):**
Four metric cards in a row:
1. **Location Info Card**
   - City name, coordinates
   - Elevation

2. **Best Conditions Probability**
   - Large percentage: "78% chance of ideal conditions"
   - Icon indicating weather type

3. **Extreme Weather Alert**
   - "15% chance of extreme heat"
   - Warning icon if probability >20%

4. **Historical Trend**
   - Arrow up/down
   - "+5% warmer than 20-year average"
   - Micro sparkline chart

**Visualization Section:**

*Chart 1: Probability Distribution (Bell Curve)*
- X-axis: Temperature/Variable range
- Y-axis: Probability (%)
- Show normal distribution with:
  - Mean line (Electric Blue)
  - Selected threshold zones (color-coded)
  - Probability of exceeding thresholds annotated
- Interactive: Hover shows exact values

*Chart 2: Historical Time Series*
- X-axis: Years (past 5 years)
- Y-axis: Variable value
- Line chart showing:
  - Daily value for selected date across years
  - Moving average trend line
  - Confidence interval shading
- Color: Blue gradient

*Chart 3: Multi-Variable Comparison*
- Radar/spider chart showing:
  - All selected variables normalized 0-100%
  - Current day vs. historical average

*Chart 4: Monthly Pattern*
- Heatmap calendar view:
  - Shows selected variable across all days of selected month
  - Color intensity indicates probability/value
  - Selected day highlighted
  - Electric Blue to Rocket Red gradient

**Data Table (Expandable Section):**
- Collapsible table showing raw statistics:
  - Variable | Mean | Median | Min | Max |
  - Sortable columns
  - Export to CSV button

**Insights Panel:**
- AI-generated text summary (conversational):
  - "Based on 30 years of data for Nairobi on August 3rd..."
  - "There's a 75% chance temperatures will be between 20-28°C"
  - "Extreme heat (>35°C) occurs only 5% of the time"
- References to data sources with links


---

## 2. DATA INTEGRATION - NASA EARTHDATA DATASETS

### 2.1 Available Datasets (Based on Experiments)

#### Dataset 1: GPM IMERG Daily (GPM_3IMERGDF v07)
**Purpose:** Precipitation data  
**Coverage:** Global, 0.1° resolution (~11km)  
**Temporal:** Daily, 2000-present  
**Access Method:** ✅ OPeNDAP streaming (no download required)

**Available Variables:**
- `precipitation` - Combined microwave-IR precipitation estimate (mm/day) ⭐ **PRIMARY**
- `MWprecipitation` - High quality microwave-only precipitation (mm/day)
- `randomError` - Precipitation uncertainty/error estimate (mm/day)
- `probabilityLiquidPrecipitation` - Probability of liquid vs frozen precipitation (%)
- `precipitation_cnt` - Number of valid measurements per day  
- `precipitation_cnt_cond` - Count where precipitation ≥ 0.01 mm/hr

**Limitations:**
- ❌ No temperature data
- ❌ No wind data  
- ❌ No humidity data
- ✅ Only precipitation-related variables

---

#### Dataset 2: MERRA-2 Hourly Single-Level (M2T1NXSLV v5.12.4)
**Purpose:** Comprehensive atmospheric conditions  
**Coverage:** Global, 0.5° × 0.625° resolution (~50km)  
**Temporal:** Hourly, 1980-present  
**Access Method:** ✅ OPeNDAP streaming

**Key Available Variables:**

| Variable | Description | Units | Processing Required |
|----------|-------------|-------|---------------------|
| `T2M` ⭐ | 2-meter air temperature | K | K → °C, hourly → daily mean |
| `U2M` | 2m eastward wind component | m/s | Combine with V2M for speed |
| `V2M` | 2m northward wind component | m/s | Combine with U2M for speed |
| `QV2M` | 2m specific humidity | kg/kg | Convert to relative humidity % |
| `PS` | Surface pressure | Pa | Pa → hPa |
| `SLP` | Sea level pressure | Pa | Pa → hPa |
| `T2MDEW` | Dew point temperature | K | K → °C |

**Derived Metrics:**
- Wind Speed: `sqrt(U2M² + V2M²)` (m/s)
- Wind Direction: `atan2(V2M, U2M)` (degrees)  
- Relative Humidity: Formula using QV2M, T2M, PS

**Note:** Hourly data requires aggregation to daily statistics (mean, min, max)

---

#### Dataset 3: MERRA-2 Daily Statistics (M2SDNXSLV v5.12.4)
**Purpose:** Pre-computed daily statistics (lighter than hourly)  
**Coverage:** Same as M2T1NXSLV  
**Temporal:** Daily, 1980-present  
**Access Method:** ✅ OPeNDAP streaming

**Available Variables:**
- `T2MMEAN` - Daily mean 2m temperature (K)
- `T2MMAX` - Daily max 2m temperature (K)
- `T2MMIN` - Daily min 2m temperature (K)

**Limitations:**
- ❌ No wind data in daily dataset
- ❌ No humidity data in daily dataset  
- ⚠️ Use hourly dataset (M2T1NXSLV) for wind/humidity

---

### 2.2 Variable-to-Dataset Mapping

| Dashboard Variable | NASA Dataset | Source Variable(s) | Processing Pipeline |
|-------------------|--------------|-------------------|---------------------|
| **Temperature (°C)** | MERRA-2 M2SDNXSLV | T2MMEAN | 1. Fetch daily T2MMEAN<br>2. Convert K → °C<br>3. Aggregate across years for statistics |
| **Precipitation (mm)** | GPM IMERG | precipitation | 1. Fetch daily precipitation<br>2. Already in mm/day<br>3. Aggregate across years |
| **Wind Speed (m/s)** | MERRA-2 M2T1NXSLV | U2M, V2M | 1. Fetch hourly U2M, V2M<br>2. Compute: sqrt(U² + V²)<br>3. Daily mean<br>4. Aggregate across years |
| **Humidity (%)** | MERRA-2 M2T1NXSLV | QV2M, T2M, PS | 1. Fetch hourly QV2M, T2M, PS<br>2. Convert specific → relative humidity<br>3. Daily mean<br>4. Aggregate across years |

---

### 2.3 Coordinate Precision & Actual Grid Points

**Important:** Users provide exact coordinates, but datasets use gridded data. Backend must:
1. Find nearest grid point to user's location
2. Return both requested AND actual coordinates used

**Example from experiments:**
```
User requests: Nyeri, Kenya (-0.4197, 36.9489)
GPM IMERG uses: (-0.45, 36.95) [~3km offset]
MERRA-2 uses: (-0.5, 36.875) [~15km offset]
```

**UI Impact:** Display both coordinates in results:
- "Showing data for: Nyeri, Kenya"
- "Nearest data point: -0.45°N, 36.95°E (3km from requested location)"

---

### 2.4 Data Fetching Strategy

#### Option A: Historical Day-of-Year Analysis (RECOMMENDED FOR HACKATHON)
**Approach:**
1. User selects: Location + Day-of-Year (e.g., August 3rd)
2. Backend fetches ALL historical data for that specific day across multiple years
   - Example: All "August 3rd" data from 2000-2024 = 24 data points
3. Compute probability statistics from historical distribution:
   - Mean, median, std dev
   - Min, max  
   - Percentiles (10th, 25th, 75th, 90th)
   - P(variable > threshold) = count(values > threshold) / total_years

**Example Query:**
```
For: Nyeri, Kenya on August 3rd
Fetch:
  - GPM IMERG: Aug 3rd from 2019-2024 (5-6 years)
  - MERRA-2: Aug 3rd from 2019-2024 (5-6 years)
Result:
  - 5-6 temperature values
  - 5-6 precipitation values
Compute:
  - P(temp > 35°C) = count(temp_values > 35) / 6
  - Mean temp = average of 6 values
```

**Benefits:**
- Fast queries (only fetching ~5-10 data points per variable)
- Recent data is more relevant for climate trends
- Easy probability calculations
- Matches challenge objective: "probability of conditions on a specific day"

**Performance Note:** Using 5-10 years instead of 20-30 years significantly reduces query time while still providing statistically meaningful probability estimates

---

## 3. BACKEND API SPECIFICATION (FastAPI)

### 3.1 Base URL
```
http://localhost:8000/api/v1
```

### 3.2 Core Endpoints

#### POST /weather/query
Fetch historical weather data and compute probabilities

**Request Body:**
```json
{
  "location": {
    "lat": -0.4197,
    "lon": 36.9489,
    "name": "Nyeri, Kenya"
  },
  "day_of_year": {
    "month": 8,
    "day": 3
  },
  "historical_years": {
    "start_year": 2019,
    "end_year": 2024
  },
  "variables": ["temperature", "precipitation", "wind_speed", "humidity"],
  "thresholds": {
    "temperature": {"hot": 35, "cold": 5},
    "precipitation": {"wet": 50},
    "wind_speed": {"windy": 40}
  }
}
```

**Response:**
```json
{
  "query_info": {
    "requested_location": {"lat": -0.4197, "lon": 36.9489, "name": "Nyeri, Kenya"},
    "actual_grid_points": {
      "precipitation": {"lat": -0.45, "lon": 36.95, "dataset": "GPM IMERG"},
      "temperature": {"lat": -0.5, "lon": 36.875, "dataset": "MERRA-2"}
    },
    "day_of_year": "August 3",
    "years_analyzed": 6,
    "data_period": "2019-2024"
  },
  "historical_data": {
    "temperature": {
      "values": [13.2, 14.5, 15.1, ...],  
      "years": [2000, 2001, 2002, ...],
      "statistics": {
        "mean": 14.95,
        "median": 14.8,
        "std": 1.2,
        "min": 12.5,
        "max": 17.3,
        "percentile_25": 14.0,
        "percentile_75": 15.8
      },
      "probabilities": {
        "above_35C": 0.0,
        "below_5C": 0.0,
        "comfortable_20_28C": 0.17
      }
    },
    "precipitation": {
      "values": [0, 0, 1.2, 5.3, ...],
      "statistics": {...},
      "probabilities": {
        "no_rain_0mm": 0.62,
        "light_rain_0_10mm": 0.25,
        "moderate_10_50mm": 0.10,
        "heavy_above_50mm": 0.03
      }
    },
    "wind_speed": {...},
    "humidity": {...}
  },
  "metadata": {
    "data_sources": {
      "temperature": {
        "name": "MERRA-2 M2SDNXSLV v5.12.4",
        "url": "https://disc.gsfc.nasa.gov/datasets/M2SDNXSLV_5.12.4/summary"
      },
      "precipitation": {
        "name": "GPM IMERG Final v07",
        "url": "https://gpm.nasa.gov/data/imerg"
      }
    },
    "units": {
      "temperature": "celsius",
      "precipitation": "mm/day",
      "wind_speed": "m/s",
      "humidity": "percent"
    }
  }
}
```

---

#### GET /weather/variables  
List available variables

**Response:**
```json
{
  "variables": [
    {
      "id": "temperature",
      "name": "Temperature",
      "description": "2-meter air temperature (daily mean)",
      "unit": "°C",
      "dataset": "MERRA-2 M2SDNXSLV",
      "available_from": "1980"
    },
    {
      "id": "precipitation",
      "name": "Precipitation",
      "description": "Daily rainfall amount",
      "unit": "mm/day",
      "dataset": "GPM IMERG",
      "available_from": "2000"
    },
    {
      "id": "wind_speed",
      "name": "Wind Speed",
      "description": "2-meter wind speed (daily mean)",
      "unit": "m/s",
      "dataset": "MERRA-2 M2T1NXSLV",
      "available_from": "1980"
    },
    {
      "id": "humidity",
      "name": "Relative Humidity",
      "description": "2-meter relative humidity (daily mean)",
      "unit": "%",
      "dataset": "MERRA-2 M2T1NXSLV",
      "available_from": "1980"
    }
  ]
}
```

---

#### POST /weather/download
Download data as CSV/JSON

**Request:** Same as `/weather/query` + `format` field

**Response:** File download (CSV or JSON)

**CSV Format:**
```csv
year,date,temperature_celsius,precipitation_mm,wind_speed_ms,humidity_percent
2000,2000-08-03,13.77,0.0,2.3,65.2
2001,2001-08-03,14.28,1.2,1.8,68.5
...
```

---

#### GET /health
Health check

**Response:**
```json
{
  "status": "healthy",
  "earthdata_authenticated": true,
  "datasets_accessible": ["GPM_3IMERGDF", "M2SDNXSLV", "M2T1NXSLV"]
}
```

---

### 3.3 Backend Service Architecture

```python
# services/earthdata_service.py

import earthaccess
import xarray as xr
import numpy as np
from datetime import datetime

class EarthdataService:
    def __init__(self):
        self.auth = earthaccess.login()
    
    async def fetch_historical_temperature(self, lat, lon, month, day, start_year, end_year):
        """
        Fetch temperature for specific day-of-year across multiple years
        Returns: list of temperature values, one per year
        """
        results = []
        for year in range(start_year, end_year + 1):
            date_str = f"{year}-{month:02d}-{day:02d}"
            
            # Search MERRA-2 daily dataset
            search_results = earthaccess.search_data(
                short_name="M2SDNXSLV",
                version="5.12.4",
                temporal=(date_str, date_str),
            )
            
            if len(search_results) > 0:
                files = earthaccess.open(search_results)
                ds = xr.open_dataset(files[0])
                
                temp_k = ds['T2MMEAN'].sel(lat=lat, lon=lon, method='nearest').values[0]
                temp_c = float(temp_k - 273.15)
                
                results.append({"year": year, "value": temp_c})
                ds.close()
        
        return results
    
    async def fetch_historical_precipitation(self, lat, lon, month, day, start_year, end_year):
        """Fetch precipitation for specific day across years"""
        # Similar logic using GPM IMERG
        pass
    
    def compute_statistics(self, values):
        """Compute mean, median, std, percentiles"""
        return {
            "mean": np.mean(values),
            "median": np.median(values),
            "std": np.std(values),
            "min": np.min(values),
            "max": np.max(values),
            "percentile_25": np.percentile(values, 25),
            "percentile_75": np.percentile(values, 75),
        }
    
    def compute_probabilities(self, values, thresholds):
        """Compute P(value > threshold)"""
        probabilities = {}
        for name, threshold in thresholds.items():
            prob = np.sum(np.array(values) > threshold) / len(values)
            probabilities[f"above_{threshold}"] = prob
        return probabilities
```

---

### 3.4 FastAPI Main Application

```python
# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Weather Probability Dashboard API")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Location(BaseModel):
    lat: float
    lon: float
    name: str = None

class DayOfYear(BaseModel):
    month: int
    day: int

class WeatherQueryRequest(BaseModel):
    location: Location
    day_of_year: DayOfYear
    historical_years: Dict[str, int]
    variables: List[str]
    thresholds: Dict = None

@app.post("/api/v1/weather/query")
async def query_weather(request: WeatherQueryRequest):
    service = EarthdataService()
    
    results = {}
    
    if "temperature" in request.variables:
        temp_data = await service.fetch_historical_temperature(
            request.location.lat,
            request.location.lon,
            request.day_of_year.month,
            request.day_of_year.day,
            request.historical_years["start_year"],
            request.historical_years["end_year"]
        )
        
        values = [d["value"] for d in temp_data]
        results["temperature"] = {
            "values": values,
            "years": [d["year"] for d in temp_data],
            "statistics": service.compute_statistics(values),
            "probabilities": service.compute_probabilities(values, request.thresholds.get("temperature", {}))
        }
    
    # Similar for other variables...
    
    return {
        "query_info": {...},
        "historical_data": results,
        "metadata": {...}
    }

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy"}
```

---

## 4. FRONTEND IMPLEMENTATION (React + shadcn)

### 4.1 Component Structure

```
src/
├── components/
│   ├── LocationSelector.tsx     # Map + search input
│   ├── DayOfYearPicker.tsx      # Month/day selector
│   ├── VariableSelector.tsx     # Checkboxes for variables
│   ├── ThresholdSettings.tsx    # Sliders for thresholds
│   ├── ResultsVisualization.tsx # Charts + statistics
│   ├── ProbabilityChart.tsx     # Bell curve / histogram
│   ├── TimeSeriesChart.tsx      # Historical trend line
│   ├── StatisticsCards.tsx      # Summary metrics
│   └── DownloadButton.tsx       # CSV/JSON export
├── services/
│   └── api.ts                   # API client
├── types/
│   └── weather.ts               # TypeScript interfaces
└── App.tsx                      # Main app
```

---

### 4.2 Visualization Components

**Charts (using shadcn chart components):**
1. **Probability Distribution Chart** - Histogram/bell curve showing distribution of historical values
2. **Historical Time Series** - Line chart showing value for selected day across years
3. **Multi-Variable Comparison** - Comparative charts for all selected variables

**Statistics Display (using shadcn Card components):**
1. **Summary Cards** - Mean, median, min, max, std dev
2. **Probability Cards** - Threshold probabilities (e.g., "78% chance temperature below 28°C")
3. **Data Quality Indicators** - Number of years analyzed, missing data warnings

---

## 5. KEY TECHNICAL DECISIONS

### Data Caching Strategy
- **Problem:** Fetching 5-10 years of data on each query can still be slow
- **Solution:**
  - Cache results in-memory (Redis) keyed by `{lat}_{lon}_{month}_{day}_{variable}`
  - TTL: 24 hours
  - Pre-cache popular locations
  - Use 5-6 year window (2019-2024) for faster queries while maintaining statistical validity

### Handling Missing Data
- **Problem:** Some days may have missing data (cloud cover, sensor issues)
- **Solution:**
  - Skip years with NaN values
  - Report actual number of years used in statistics
  - Show data quality indicator in UI

### Coordinate Rounding
- **Problem:** Different datasets have different grid resolutions
- **Solution:**
  - Always return actual grid point coordinates used
  - Show distance offset in UI
  - Warn if offset > 100km

---

## 6. TESTING CHECKLIST

- [ ] Test with equatorial location (Nyeri, Kenya: -0.4197, 36.9489)
- [ ] Test with northern hemisphere location (New York: 40.7128, -74.0060)
- [ ] Test with southern hemisphere location (Sydney: -33.8688, 151.2093)
- [ ] Test edge cases: poles, date line
- [ ] Test all 4 variables together
- [ ] Test with extreme thresholds
- [ ] Test CSV download
- [ ] Test with slow network
- [ ] Test mobile responsiveness

---

## APPENDIX: Dataset URLs & References

**GPM IMERG:**
- Product Page: https://gpm.nasa.gov/data/imerg
- Dataset: GPM_3IMERGDF v07
- DOI: 10.5067/GPM/IMERGDF/DAY/07

**MERRA-2:**
- Product Page: https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/
- Daily Dataset: M2SDNXSLV v5.12.4
- Hourly Dataset: M2T1NXSLV v5.12.4

**Earthaccess Library:**
- GitHub: https://github.com/nsidc/earthaccess
- Docs: https://earthaccess.readthedocs.io/

