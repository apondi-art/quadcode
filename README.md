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
- pyenv (Python version management tool)
- Poetry (Python dependency management tool)
- NASA Earthdata Login account ([register here](https://urs.earthdata.nasa.gov/users/new))

### 1. Install pyenv

pyenv allows you to manage multiple Python versions on your system.

**Linux/macOS/WSL:**
```bash
curl https://pyenv.run | bash
```

Add pyenv to your shell configuration (`~/.bashrc`, `~/.zshrc`, or `~/.profile`):
```bash
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
```

Reload your shell:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

**Windows:**
Use [pyenv-win](https://github.com/pyenv-win/pyenv-win#installation):
```powershell
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "./install-pyenv-win.ps1"; &"./install-pyenv-win.ps1"
```

Verify installation:
```bash
pyenv --version
```

### 2. Install and Set Python Version

Install Python 3.10 (recommended for this project):
```bash
pyenv install 3.10
```

Set the local Python version for this project:
```bash
cd quadcode
pyenv local 3.10
```

This creates a `.python-version` file that automatically activates Python 3.10 when you're in this directory.

Verify:
```bash
python --version  # Should show Python 3.10.x
```

### 3. Install Poetry

If you don't have Poetry installed, install it using one of these methods:

**Linux/macOS/WSL:**
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

**Windows (PowerShell):**
```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

After installation, add Poetry to your PATH:
```bash
export PATH="/home/$USER/.local/bin:$PATH"  # Linux/macOS/WSL
```

Add this line to your `~/.bashrc` or `~/.zshrc` to make it permanent.

Verify installation:
```bash
poetry --version
```

### 4. Install Dependencies

Clone the repository and install project dependencies:
```bash
git clone https://github.com/apondi-art/quadcode.git
cd quadcode/backend
poetry install
```

This will create a virtual environment and install all dependencies listed in `pyproject.toml`.

## Project Structure

```
quadcode/
├── backend/
│   ├── quadcode/              # Main Python package
│   │   ├── app/              # FastAPI application
│   │   │   ├── api/          # API endpoints
│   │   │   ├── core/         # Core configuration
│   │   │   ├── models/       # Data models
│   │   │   └── services/     # Business logic
│   │   ├── main.py           # Application entry point
│   │   └── __init__.py
│   ├── scripts/              # Utility scripts
│   │   ├── test_earthdata.py
│   │   └── temperature_nyeri.py
│   ├── pyproject.toml        # Poetry dependencies
│   └── poetry.lock
└── README.md
```

### 5. Configure NASA Earthdata Authentication

To stream data from NASA Earthdata, you need to generate three prerequisite files that contain your authentication credentials. These files enable secure access to NASA Earth observation data archives.

#### What You'll Need
- A NASA Earthdata Login account ([register here](https://urs.earthdata.nasa.gov/users/new))
- Your Earthdata username and password

#### Required Files

**`.netrc` File** - Contains your Earthdata Login credentials. Required for authentication with NASA Earthdata servers.

**`.urs_cookies` File** - Stores authentication cookies for command-line tools (wget, curl).

**`.dodsrc` File** - Contains file paths to .netrc and .urs_cookies files. Required for OPeNDAP server access.

#### Setup Instructions

##### Linux/macOS/WSL

**1. Create .netrc file:**
```bash
cat > ~/.netrc << EOF
machine urs.earthdata.nasa.gov
    login YOUR_USERNAME
    password YOUR_PASSWORD
EOF
chmod 600 ~/.netrc
```

**2. Create .urs_cookies file:**
```bash
touch ~/.urs_cookies
chmod 600 ~/.urs_cookies
```

**3. Create .dodsrc file:**
```bash
cat > ~/.dodsrc << EOF
HTTP.NETRC=$HOME/.netrc
HTTP.COOKIE.JAR=$HOME/.urs_cookies
EOF
```

##### Windows

**1. Create _netrc file:**

Create a file named `_netrc` (note the underscore) in `C:\Users\YourUsername\` with the following content:
```
machine urs.earthdata.nasa.gov
    login YOUR_USERNAME
    password YOUR_PASSWORD
```

**2. Create .urs_cookies file:**
```powershell
New-Item -Path "$env:USERPROFILE\.urs_cookies" -ItemType File
```

**3. Create .dodsrc file:**

Create a file named `.dodsrc` in both:
- Your home directory: `C:\Users\YourUsername\.dodsrc`
- Your current working directory (where you run the application)

Content:
```
HTTP.NETRC=C:\Users\YourUsername\_netrc
HTTP.COOKIE.JAR=C:\Users\YourUsername\.urs_cookies
```

**Important for Windows users:** The `.dodsrc` file must be in both your home directory AND your current working directory.

#### Alternative: Interactive Authentication

For first-time setup, you can also authenticate interactively using Python:

```bash
poetry run python -c "import earthaccess; earthaccess.login()"
```

This will prompt for your credentials and automatically generate the necessary files.

#### Verify Authentication

After creating the files, verify your setup works by starting the API server (see section 6 below).

### 6. Start the API Server

Navigate to the backend directory and run the FastAPI server:

```bash
cd backend
poetry run python quadcode/main.py
```

The server will start on `http://localhost:8000`

- **API Documentation**: http://localhost:8000/docs (interactive Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/v1/health

## Testing the API with curl

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
- Run commands with `poetry run` prefix
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
