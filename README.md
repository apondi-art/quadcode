# Personalized Weather Likelihood Dashboard

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
- **Backend**: Python (Flask/FastAPI/Django REST) for API endpoints and data processing.
- **Frontend**: Interactive UI (React) for queries, graphs, and maps.
- **Data**: NASA Earth observation datasets (temperature, precipitation, wind, humidity, etc.).

##  Example Use Case
- A hiker planning a trail in July can check how likely it is to be **very hot** or **very wet** at their chosen location.
- A fishing trip planner can assess **wind speed and rainfall probabilities** before setting a date.
- Event organizers can estimate the odds of **uncomfortable weather conditions** months in advance.

## Data Access
- Users can query conditions via the app’s interface.
- Historical data and computed probabilities are available for **download** in CSV or JSON.

---

🔗 Built for the NASA Space Apps Challenge 2025: *Exploring the world through open data*.
