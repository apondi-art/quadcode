# Personalized Weather Dashboard

This project was developed for the **2025 NASA Space Apps Challenge**.  
It is a web application that helps users explore the **likelihood of extreme weather conditions** for a specific **location** and **time of year**, using historical NASA Earth observation data.

##  Features
- Search for a location by name or select from an interactive map.
- Choose a date (day of the year) to analyze.
- Select weather conditions of interest:
  - Very Hot
  - Very Cold
  - Very Wet
  - Very Windy
  - Very Uncomfortable (heat index / humidity).
- View **probabilities** of these conditions based on historical data.
- Visualize results with:
  - Graphs (time series, probability distributions).
  - Maps (heatmaps for conditions).
- Download results in **JSON** or **CSV** format for further analysis.

##  Tech Stack
- **Backend**: Python  for API endpoints and data processing.
- **Frontend**: Interactive UI (React) for queries, graphs, and maps.
- **Data**: NASA Earth observation datasets (temperature, precipitation, wind, humidity, etc.).

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Poetry (Python dependency management tool)
- NASA Earthdata Login account ([register here](https://urs.earthdata.nasa.gov/users/new))

### 1. Install Poetry

If you don't have Poetry installed, install it using one of these methods:

**Linux/macOS/WSL:**
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

**Windows (PowerShell):**
```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

After installation, add Poetry to your PATH and verify:
```bash
poetry --version
```

### 2. Install Dependencies

Clone the repository and install project dependencies:
```bash
git clone https://github.com/apondi-art/quadcode.git
cd quadcode
poetry install
```

This will create a virtual environment and install all dependencies listed in `pyproject.toml`.

### 3. Configure NASA Earthdata Authentication

To stream data from NASA Earthdata, you need to set up authentication credentials.

#### Option A: Using .netrc file (Recommended)

Create a `.netrc` file in your home directory with your NASA Earthdata credentials:

**Linux/macOS/WSL:**
```bash
cat > ~/.netrc << EOF
machine urs.earthdata.nasa.gov
    login YOUR_USERNAME
    password YOUR_PASSWORD
EOF
chmod 600 ~/.netrc
```

**Windows:**
Create a file named `_netrc` in `C:\Users\YourUsername\` with the following content:
```
machine urs.earthdata.nasa.gov
    login YOUR_USERNAME
    password YOUR_PASSWORD
```

#### Option B: Using .urs_cookies file

Alternatively, you can use a cookies file. Create `.urs_cookies` in your home directory:

**Linux/macOS/WSL:**
```bash
touch ~/.urs_cookies
chmod 600 ~/.urs_cookies
```

**Windows:**
```powershell
New-Item -Path "$env:USERPROFILE\.urs_cookies" -ItemType File
```

**Note:** When using earthaccess for the first time, you can also authenticate interactively:
```python
import earthaccess
earthaccess.login()  # Will prompt for credentials and save them
```

### 4. Verify Setup

Run the test scripts to verify your setup is working correctly:

**Activate the Poetry environment:**
```bash
poetry shell
```

**Test precipitation data streaming:**
```bash
python test_earthdata.py
```

This will:
- Authenticate with NASA Earthdata
- Search for GPM IMERG precipitation data for August 2024
- Stream data for Nyeri, Kenya via OPeNDAP (no download required)
- Generate `nyeri_precipitation_august_2024.csv`

**Test temperature data streaming:**
```bash
python temperature_nyeri.py
```

This will:
- Authenticate with NASA Earthdata
- Search for MERRA-2 temperature data for August 2024
- Stream data for Nyeri, Kenya via OPeNDAP
- Generate `nyeri_temperature_august_2024.csv`

If both scripts run successfully and generate CSV files, your setup is complete!

## Running the API Server

### Start the Server

Run the FastAPI server:

```bash
poetry run python main.py
```

The server will start on `http://localhost:8000`

- **API Documentation**: http://localhost:8000/docs (interactive Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/v1/health

### Testing the API with curl

#### 1. Health Check

```bash
curl http://localhost:8000/api/v1/health
```

#### 2. Query Temperature and Precipitation

```bash
curl -X POST http://localhost:8000/api/v1/weather/query \
  -H "Content-Type: application/json" \
  -d '{
    "location": {
      "lat": -0.4197,
      "lon": 36.9489,
      "name": "Nyeri, Kenya"
    },
    "day_of_year": {
      "month": 4,
      "day": 15
    },
    "historical_years": {
      "start_year": 2024,
      "end_year": 2024
    },
    "variables": ["temperature", "precipitation"],
    "thresholds": {
      "temperature": {"hot": 35, "cold": 5},
      "precipitation": {"wet": 50}
    }
  }'
```

**Expected Response Time**: ~30-60 seconds

#### 3. Query Wind Speed (slower)

```bash
curl -X POST http://localhost:8000/api/v1/weather/query \
  -H "Content-Type: application/json" \
  -d '{
    "location": {
      "lat": -0.4197,
      "lon": 36.9489,
      "name": "Nyeri, Kenya"
    },
    "day_of_year": {
      "month": 8,
      "day": 21
    },
    "historical_years": {
      "start_year": 2024,
      "end_year": 2024
    },
    "variables": ["wind_speed"],
    "thresholds": {
      "wind_speed": {"windy": 10}}
  }'
```

**Expected Response Time**: ~2-3 minutes (uses hourly MERRA-2 dataset)

#### 4. Query All Variables

```bash
curl -X POST http://localhost:8000/api/v1/weather/query \
  -H "Content-Type: application/json" \
  -d '{
    "location": {
      "lat": -0.4197,
      "lon": 36.9489,
      "name": "Nyeri, Kenya"
    },
    "day_of_year": {
      "month": 4,
      "day": 15
    },
    "historical_years": {
      "start_year": 2022,
      "end_year": 2024
    },
    "variables": ["temperature", "precipitation", "wind_speed", "humidity"],
    "thresholds": {
      "temperature": {"hot": 35, "cold": 5},
      "precipitation": {"wet": 50},
      "wind_speed": {"windy": 40},
      "humidity": {"humid": 80}
    }
  }'
```

### API Response Format

The API returns JSON with:
- **query_info**: Requested location, actual grid points used, date range
- **historical_data**: For each variable:
  - `values`: Historical data values
  - `years`: Corresponding years
  - `statistics`: mean, median, std, min, max, percentiles
  - `probabilities`: Based on provided thresholds
- **metadata**: Data sources and units

### Performance Notes

- **Temperature & Precipitation**: Fast (~30-60 sec per year)
- **Wind & Humidity**: Slower (~2-3 min per year) - uses hourly dataset with midday sampling
- For faster queries, use shorter year ranges (e.g., 2022-2024 instead of 2000-2024)

### Troubleshooting

**Authentication errors:**
- Verify your NASA Earthdata credentials are correct
- Ensure `.netrc` file has proper permissions (600 on Unix systems)
- Try interactive login: `python -c "import earthaccess; earthaccess.login()"`

**Module not found errors:**
- Ensure you're in the Poetry virtual environment: `poetry shell`
- Reinstall dependencies: `poetry install`

**Data access errors:**
- Some datasets may require additional approvals. Visit [Earthdata](https://urs.earthdata.nasa.gov/) and approve applications for GPM and MERRA-2 datasets.

##  Example Use Case
- A hiker planning a trail in July can check how likely it is to be **very hot** or **very wet** at their chosen location.
- A fishing trip planner can assess **wind speed and rainfall probabilities** before setting a date.
- Event organizers can estimate the odds of **uncomfortable weather conditions** months in advance.

## Data Access
- Users can query conditions via the app’s interface.
- Historical data and computed probabilities are available for **download** in CSV or JSON.

---

 Built for the NASA Space Apps Challenge 2025: *Exploring the world through open data*.
