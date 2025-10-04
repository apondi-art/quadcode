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

    async def _fetch_temperature_single_year(
        self,
        lat: float,
        lon: float,
        month: int,
        day: int,
        year: int
    ) -> Optional[Dict]:
        """Fetch temperature data for a single year"""
        try:
            date_str = f"{year}-{month:02d}-{day:02d}"
            logger.info(f"Fetching temperature for {date_str}")

            search_results = earthaccess.search_data(
                short_name="M2SDNXSLV",
                version="5.12.4",
                temporal=(date_str, date_str),
            )

            if len(search_results) > 0:
                files = earthaccess.open(search_results)
                with xr.open_dataset(files[0]) as ds:
                    temp_data = ds['T2MMEAN'].sel(lat=lat, lon=lon, method='nearest')
                    actual_lat = float(temp_data.lat.values)
                    actual_lon = float(temp_data.lon.values)

                    temp_values = temp_data.values
                    if len(temp_values) == 0:
                        logger.warning(f"Empty data array for {date_str}")
                        return None

                    temp_k = float(temp_values[0])
                    temp_c = temp_k - 273.15

                    logger.info(f"Fetched temperature for {year}: {temp_c:.2f}°C")
                    return {
                        "temp_c": temp_c,
                        "actual_lat": actual_lat,
                        "actual_lon": actual_lon
                    }
            else:
                logger.warning(f"No temperature data found for {date_str}")
                return None

        except Exception as e:
            logger.error(f"Error fetching temperature for {year}: {e}")
            return None

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
        Fetch temperature data from MERRA-2 daily dataset using parallel requests

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
        import asyncio

        values = []
        years = []
        actual_lat = None
        actual_lon = None
        missing_years = []

        # Fetch all years in parallel
        year_range = list(range(start_year, end_year + 1))
        tasks = [
            self._fetch_temperature_single_year(lat, lon, month, day, year)
            for year in year_range
        ]

        results = await asyncio.gather(*tasks)

        # Process results
        for year, result in zip(year_range, results):
            if result is not None:
                values.append(result["temp_c"])
                years.append(year)
                if actual_lat is None:
                    actual_lat = result["actual_lat"]
                    actual_lon = result["actual_lon"]
            else:
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

    async def _fetch_precipitation_single_year(
        self,
        lat: float,
        lon: float,
        month: int,
        day: int,
        year: int
    ) -> Optional[Dict]:
        """Fetch precipitation data for a single year"""
        try:
            date_str = f"{year}-{month:02d}-{day:02d}"
            logger.info(f"Fetching precipitation for {date_str}")

            search_results = earthaccess.search_data(
                short_name="GPM_3IMERGDF",
                version="07",
                temporal=(date_str, date_str),
            )

            if len(search_results) > 0:
                files = earthaccess.open(search_results)
                with xr.open_dataset(files[0]) as ds:
                    precip_data = ds['precipitation'].sel(lat=lat, lon=lon, method='nearest')
                    actual_lat = float(precip_data.lat.values)
                    actual_lon = float(precip_data.lon.values)

                    precip_values = precip_data.values
                    if len(precip_values) == 0:
                        logger.warning(f"Empty data array for {date_str}")
                        return None

                    precip_mm = float(precip_values[0])

                    logger.info(f"Fetched precipitation for {year}: {precip_mm:.2f}mm")
                    return {
                        "precip_mm": precip_mm,
                        "actual_lat": actual_lat,
                        "actual_lon": actual_lon
                    }
            else:
                logger.warning(f"No precipitation data found for {date_str}")
                return None

        except Exception as e:
            logger.error(f"Error fetching precipitation for {year}: {e}")
            return None

    async def _fetch_wind_single_year(
        self,
        lat: float,
        lon: float,
        month: int,
        day: int,
        year: int
    ) -> Optional[Dict]:
        """Fetch wind speed data for a single year"""
        import numpy as np

        try:
            date_str = f"{year}-{month:02d}-{day:02d}"
            logger.info(f"Fetching wind data for {date_str}")

            search_results = earthaccess.search_data(
                short_name="M2T1NXSLV",
                version="5.12.4",
                temporal=(date_str, date_str),
            )

            if len(search_results) > 0:
                files = earthaccess.open(search_results)
                with xr.open_dataset(files[0]) as ds:
                    u_wind = ds['U2M'].isel(time=12).sel(lat=lat, lon=lon, method='nearest')
                    v_wind = ds['V2M'].isel(time=12).sel(lat=lat, lon=lon, method='nearest')

                    actual_lat = float(u_wind.lat.values)
                    actual_lon = float(u_wind.lon.values)

                    wind_speed_midday = np.sqrt(u_wind**2 + v_wind**2)

                    if wind_speed_midday.size == 0:
                        logger.warning(f"Empty wind data for {date_str}")
                        return None

                    wind_speed_daily = float(wind_speed_midday.values)

                    logger.info(f"Fetched wind speed for {year}: {wind_speed_daily:.2f} m/s")
                    return {
                        "wind_speed": wind_speed_daily,
                        "actual_lat": actual_lat,
                        "actual_lon": actual_lon
                    }
            else:
                logger.warning(f"No wind data found for {date_str}")
                return None

        except Exception as e:
            logger.error(f"Error fetching wind data for {year}: {e}")
            return None

    async def _fetch_humidity_single_year(
        self,
        lat: float,
        lon: float,
        month: int,
        day: int,
        year: int
    ) -> Optional[Dict]:
        """Fetch humidity data for a single year"""
        import numpy as np

        try:
            date_str = f"{year}-{month:02d}-{day:02d}"
            logger.info(f"Fetching humidity data for {date_str}")

            search_results = earthaccess.search_data(
                short_name="M2T1NXSLV",
                version="5.12.4",
                temporal=(date_str, date_str),
            )

            if len(search_results) > 0:
                files = earthaccess.open(search_results)
                with xr.open_dataset(files[0]) as ds:
                    qv = ds['QV2M'].isel(time=12).sel(lat=lat, lon=lon, method='nearest')
                    temp_k = ds['T2M'].isel(time=12).sel(lat=lat, lon=lon, method='nearest')
                    pressure = ds['PS'].isel(time=12).sel(lat=lat, lon=lon, method='nearest')

                    actual_lat = float(qv.lat.values)
                    actual_lon = float(qv.lon.values)

                    if qv.size == 0:
                        logger.warning(f"Empty humidity data for {date_str}")
                        return None

                    temp_c = temp_k - 273.15
                    es = 611.2 * np.exp(17.67 * temp_c / (temp_k - 29.65))
                    rh_midday = 100.0 * (qv * pressure) / (0.622 * es)
                    rh_midday = np.clip(rh_midday, 0, 100)
                    rh_daily = float(rh_midday.values)

                    logger.info(f"Fetched humidity for {year}: {rh_daily:.2f}%")
                    return {
                        "humidity": rh_daily,
                        "actual_lat": actual_lat,
                        "actual_lon": actual_lon
                    }
            else:
                logger.warning(f"No humidity data found for {date_str}")
                return None

        except Exception as e:
            logger.error(f"Error fetching humidity data for {year}: {e}")
            return None

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
        Fetch precipitation data from GPM IMERG using parallel requests

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
        import asyncio

        values = []
        years = []
        actual_lat = None
        actual_lon = None
        missing_years = []

        # Fetch all years in parallel
        year_range = list(range(start_year, end_year + 1))
        tasks = [
            self._fetch_precipitation_single_year(lat, lon, month, day, year)
            for year in year_range
        ]

        results = await asyncio.gather(*tasks)

        # Process results
        for year, result in zip(year_range, results):
            if result is not None:
                values.append(result["precip_mm"])
                years.append(year)
                if actual_lat is None:
                    actual_lat = result["actual_lat"]
                    actual_lon = result["actual_lon"]
            else:
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
        Fetch wind speed data from MERRA-2 hourly dataset using parallel requests
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
        import asyncio

        values = []
        years = []
        actual_lat = None
        actual_lon = None
        missing_years = []

        # Fetch all years in parallel
        year_range = list(range(start_year, end_year + 1))
        tasks = [
            self._fetch_wind_single_year(lat, lon, month, day, year)
            for year in year_range
        ]

        results = await asyncio.gather(*tasks)

        # Process results
        for year, result in zip(year_range, results):
            if result is not None:
                values.append(result["wind_speed"])
                years.append(year)
                if actual_lat is None:
                    actual_lat = result["actual_lat"]
                    actual_lon = result["actual_lon"]
            else:
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
        Fetch relative humidity data from MERRA-2 hourly dataset using parallel requests
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
        import asyncio

        values = []
        years = []
        actual_lat = None
        actual_lon = None
        missing_years = []

        # Fetch all years in parallel
        year_range = list(range(start_year, end_year + 1))
        tasks = [
            self._fetch_humidity_single_year(lat, lon, month, day, year)
            for year in year_range
        ]

        results = await asyncio.gather(*tasks)

        # Process results
        for year, result in zip(year_range, results):
            if result is not None:
                values.append(result["humidity"])
                years.append(year)
                if actual_lat is None:
                    actual_lat = result["actual_lat"]
                    actual_lon = result["actual_lon"]
            else:
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
