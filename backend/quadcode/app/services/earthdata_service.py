#!/usr/bin/env python3
"""
Service for fetching NASA Earthdata weather data
"""

import earthaccess
import xarray as xr
from typing import Dict, List, Optional
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)


class EarthdataService:
    """Service for fetching data from NASA Earthdata"""

    def __init__(self):
        """Initialize and authenticate with NASA Earthdata"""
        try:
            self.auth = earthaccess.login()
            logger.info("Successfully authenticated with NASA Earthdata")
        except Exception as e:
            logger.error(f"Failed to authenticate with NASA Earthdata: {e}")
            raise


    async def fetch_temperature_data(
        self,
        lat: float,
        lon: float,
        month: int,
        day: int,
        start_year: int,
        end_year: int
    ) -> Dict:
        """
        Fetch temperature data from MERRA-2 daily dataset

        Args:
            lat: Latitude
            lon: Longitude
            month: Month (1-12)
            day: Day of month (1-31)
            start_year: Start year
            end_year: End year

        Returns:
            Dict with values, years, actual_lat, actual_lon, missing_years
        """
        values = []
        years = []
        actual_lat = None
        actual_lon = None
        missing_years = []

        for year in range(start_year, end_year + 1):
            try:
                date_str = f"{year}-{month:02d}-{day:02d}"
                logger.info(f"Fetching temperature for {date_str}")

                # Search MERRA-2 daily dataset
                search_results = earthaccess.search_data(
                    short_name="M2SDNXSLV",
                    version="5.12.4",
                    temporal=(date_str, date_str),
                )

                if len(search_results) > 0:
                    files = earthaccess.open(search_results)
                    with xr.open_dataset(files[0]) as ds:
                        # Select nearest grid point
                        temp_data = ds['T2MMEAN'].sel(lat=lat, lon=lon, method='nearest')

                        # Get actual coordinates (only once)
                        if actual_lat is None:
                            actual_lat = float(temp_data.lat.values)
                            actual_lon = float(temp_data.lon.values)

                        # Convert Kelvin to Celsius
                        temp_values = temp_data.values
                        if len(temp_values) == 0:
                            logger.warning(f"Empty data array for {date_str}")
                            missing_years.append(year)
                            continue

                        temp_k = float(temp_values[0])
                        temp_c = temp_k - 273.15

                        values.append(temp_c)
                        years.append(year)
                        logger.info(f"Fetched temperature for {year}: {temp_c:.2f}°C")
                else:
                    logger.warning(f"No temperature data found for {date_str}")
                    missing_years.append(year)

            except Exception as e:
                logger.error(f"Error fetching temperature for {year}: {e}")
                missing_years.append(year)

        if missing_years:
            logger.warning(f"Missing temperature data for years: {missing_years}")

        return {
            "values": values,
            "years": years,
            "actual_lat": actual_lat,
            "actual_lon": actual_lon,
            "missing_years": missing_years
        }

    async def fetch_precipitation_data(
        self,
        lat: float,
        lon: float,
        month: int,
        day: int,
        start_year: int,
        end_year: int
    ) -> Dict:
        """
        Fetch precipitation data from GPM IMERG

        Args:
            lat: Latitude
            lon: Longitude
            month: Month (1-12)
            day: Day of month (1-31)
            start_year: Start year
            end_year: End year

        Returns:
            Dict with values, years, actual_lat, actual_lon, missing_years
        """
        values = []
        years = []
        actual_lat = None
        actual_lon = None
        missing_years = []

        for year in range(start_year, end_year + 1):
            try:
                date_str = f"{year}-{month:02d}-{day:02d}"
                logger.info(f"Fetching precipitation for {date_str}")

                # Search GPM IMERG daily dataset
                search_results = earthaccess.search_data(
                    short_name="GPM_3IMERGDF",
                    version="07",
                    temporal=(date_str, date_str),
                )

                if len(search_results) > 0:
                    files = earthaccess.open(search_results)
                    with xr.open_dataset(files[0]) as ds:
                        # Select nearest grid point
                        precip_data = ds['precipitation'].sel(lat=lat, lon=lon, method='nearest')

                        # Get actual coordinates (only once)
                        if actual_lat is None:
                            actual_lat = float(precip_data.lat.values)
                            actual_lon = float(precip_data.lon.values)

                        precip_values = precip_data.values
                        if len(precip_values) == 0:
                            logger.warning(f"Empty data array for {date_str}")
                            missing_years.append(year)
                            continue

                        precip_mm = float(precip_values[0])

                        values.append(precip_mm)
                        years.append(year)
                        logger.info(f"Fetched precipitation for {year}: {precip_mm:.2f}mm")
                else:
                    logger.warning(f"No precipitation data found for {date_str}")
                    missing_years.append(year)

            except Exception as e:
                logger.error(f"Error fetching precipitation for {year}: {e}")
                missing_years.append(year)

        if missing_years:
            logger.warning(f"Missing precipitation data for years: {missing_years}")

        return {
            "values": values,
            "years": years,
            "actual_lat": actual_lat,
            "actual_lon": actual_lon,
            "missing_years": missing_years
        }

    async def fetch_wind_data(
        self,
        lat: float,
        lon: float,
        month: int,
        day: int,
        start_year: int,
        end_year: int
    ) -> Dict:
        """
        Fetch wind speed data from MERRA-2 hourly dataset
        Computes daily mean wind speed from hourly U2M and V2M components

        Args:
            lat: Latitude
            lon: Longitude
            month: Month (1-12)
            day: Day of month (1-31)
            start_year: Start year
            end_year: End year

        Returns:
            Dict with values, years, actual_lat, actual_lon, missing_years
        """
        import numpy as np

        values = []
        years = []
        actual_lat = None
        actual_lon = None
        missing_years = []

        for year in range(start_year, end_year + 1):
            try:
                date_str = f"{year}-{month:02d}-{day:02d}"
                logger.info(f"Fetching wind data for {date_str}")

                # Search MERRA-2 hourly dataset
                search_results = earthaccess.search_data(
                    short_name="M2T1NXSLV",
                    version="5.12.4",
                    temporal=(date_str, date_str),
                )

                if len(search_results) > 0:
                    files = earthaccess.open(search_results)
                    with xr.open_dataset(files[0]) as ds:
                        # Select nearest grid point AND midday time (12:00 UTC, index 12)
                        # This is much faster than averaging multiple hours
                        u_wind = ds['U2M'].isel(time=12).sel(lat=lat, lon=lon, method='nearest')
                        v_wind = ds['V2M'].isel(time=12).sel(lat=lat, lon=lon, method='nearest')

                        # Get actual coordinates (only once)
                        if actual_lat is None:
                            actual_lat = float(u_wind.lat.values)
                            actual_lon = float(u_wind.lon.values)

                        # Compute wind speed at midday: sqrt(u² + v²)
                        wind_speed_midday = np.sqrt(u_wind**2 + v_wind**2)

                        # Check for empty data
                        if wind_speed_midday.size == 0:
                            logger.warning(f"Empty wind data for {date_str}")
                            missing_years.append(year)
                            continue

                        # Use midday wind speed as daily representative value
                        wind_speed_daily = float(wind_speed_midday.values)

                        values.append(wind_speed_daily)
                        years.append(year)
                        logger.info(f"Fetched wind speed for {year}: {wind_speed_daily:.2f} m/s")
                else:
                    logger.warning(f"No wind data found for {date_str}")
                    missing_years.append(year)

            except Exception as e:
                logger.error(f"Error fetching wind data for {year}: {e}")
                missing_years.append(year)

        if missing_years:
            logger.warning(f"Missing wind data for years: {missing_years}")

        return {
            "values": values,
            "years": years,
            "actual_lat": actual_lat,
            "actual_lon": actual_lon,
            "missing_years": missing_years
        }

    async def fetch_humidity_data(
        self,
        lat: float,
        lon: float,
        month: int,
        day: int,
        start_year: int,
        end_year: int
    ) -> Dict:
        """
        Fetch relative humidity data from MERRA-2 hourly dataset
        Computes daily mean relative humidity from hourly QV2M (specific humidity)

        Args:
            lat: Latitude
            lon: Longitude
            month: Month (1-12)
            day: Day of month (1-31)
            start_year: Start year
            end_year: End year

        Returns:
            Dict with values, years, actual_lat, actual_lon, missing_years
        """
        import numpy as np

        values = []
        years = []
        actual_lat = None
        actual_lon = None
        missing_years = []

        for year in range(start_year, end_year + 1):
            try:
                date_str = f"{year}-{month:02d}-{day:02d}"
                logger.info(f"Fetching humidity data for {date_str}")

                # Search MERRA-2 hourly dataset
                search_results = earthaccess.search_data(
                    short_name="M2T1NXSLV",
                    version="5.12.4",
                    temporal=(date_str, date_str),
                )

                if len(search_results) > 0:
                    files = earthaccess.open(search_results)
                    with xr.open_dataset(files[0]) as ds:
                        # Get midday values (12:00 UTC, index 12) only
                        # This is much faster than averaging multiple hours
                        qv = ds['QV2M'].isel(time=12).sel(lat=lat, lon=lon, method='nearest')
                        temp_k = ds['T2M'].isel(time=12).sel(lat=lat, lon=lon, method='nearest')
                        pressure = ds['PS'].isel(time=12).sel(lat=lat, lon=lon, method='nearest')

                        # Get actual coordinates (only once)
                        if actual_lat is None:
                            actual_lat = float(qv.lat.values)
                            actual_lon = float(qv.lon.values)

                        # Check for empty data
                        if qv.size == 0:
                            logger.warning(f"Empty humidity data for {date_str}")
                            missing_years.append(year)
                            continue

                        # Convert specific humidity to relative humidity at midday
                        # Formula: RH = 100 * (qv * pressure) / (0.622 * es)
                        # where es is saturation vapor pressure
                        # es(T) = 611.2 * exp(17.67 * (T-273.15) / (T-29.65))

                        temp_c = temp_k - 273.15
                        es = 611.2 * np.exp(17.67 * temp_c / (temp_k - 29.65))  # Saturation vapor pressure (Pa)
                        rh_midday = 100.0 * (qv * pressure) / (0.622 * es)

                        # Clip to valid range [0, 100]
                        rh_midday = np.clip(rh_midday, 0, 100)

                        # Use midday relative humidity as daily representative value
                        rh_daily = float(rh_midday.values)

                        values.append(rh_daily)
                        years.append(year)
                        logger.info(f"Fetched humidity for {year}: {rh_daily:.2f}%")
                else:
                    logger.warning(f"No humidity data found for {date_str}")
                    missing_years.append(year)

            except Exception as e:
                logger.error(f"Error fetching humidity data for {year}: {e}")
                missing_years.append(year)

        if missing_years:
            logger.warning(f"Missing humidity data for years: {missing_years}")

        return {
            "values": values,
            "years": years,
            "actual_lat": actual_lat,
            "actual_lon": actual_lon,
            "missing_years": missing_years
        }


@lru_cache(maxsize=1)
def get_earthdata_service() -> EarthdataService:
    """
    Get singleton instance of EarthdataService.
    This ensures we only authenticate once and reuse the service instance.
    """
    return EarthdataService()
