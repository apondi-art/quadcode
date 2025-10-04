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
