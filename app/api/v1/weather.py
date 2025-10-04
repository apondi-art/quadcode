#!/usr/bin/env python3
"""
Weather API endpoints
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict
from calendar import month_name
import logging

from app.models.weather import (
    WeatherQueryRequest,
    WeatherQueryResponse,
    QueryInfo,
    VariableData,
    Statistics,
    GridPoint,
    DataSource,
    Metadata,
    Location
)
from app.services.earthdata_service import EarthdataService, get_earthdata_service
from app.core.utils import compute_statistics, compute_probabilities, compute_grid_offset

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/query", response_model=WeatherQueryResponse)
async def query_weather(
    request: WeatherQueryRequest,
    service: EarthdataService = Depends(get_earthdata_service)
):
    """
    Query historical weather data for a given location and day-of-year

    Args:
        request: Weather query request with location, date, variables, thresholds
        service: EarthdataService instance (injected)

    Returns:
        WeatherQueryResponse with historical data, statistics, and probabilities

    Raises:
        HTTPException: 400 for invalid parameters, 500 for server errors
    """
    try:

        # Extract request parameters
        lat = request.location.lat
        lon = request.location.lon
        month = request.day_of_year.month
        day = request.day_of_year.day
        start_year = request.historical_years.start_year
        end_year = request.historical_years.end_year

        logger.info(f"Processing query for {request.location.name or f'({lat}, {lon})'} on {month}/{day}")

        # Fetch data for each requested variable
        historical_data = {}
        actual_grid_points = {}
        missing_data = {}

        for variable in request.variables:
            logger.info(f"Fetching {variable} data")

            if variable == "temperature":
                data = await service.fetch_temperature_data(lat, lon, month, day, start_year, end_year)

                if data["values"]:
                    # Compute statistics
                    stats = compute_statistics(data["values"])

                    # Compute probabilities if thresholds provided
                    probs = {}
                    if request.thresholds and variable in request.thresholds:
                        probs = compute_probabilities(data["values"], request.thresholds[variable])

                    # Store variable data
                    historical_data[variable] = VariableData(
                        values=data["values"],
                        years=data["years"],
                        statistics=Statistics(**stats),
                        probabilities=probs
                    )

                    # Store grid point info
                    if data["actual_lat"] is not None and data["actual_lon"] is not None:
                        actual_grid_points[variable] = GridPoint(
                            lat=data["actual_lat"],
                            lon=data["actual_lon"],
                            dataset="MERRA-2 M2SDNXSLV"
                        )

                    # Store missing years
                    if data["missing_years"]:
                        missing_data[variable] = data["missing_years"]
                        logger.warning(f"Missing {variable} data for years: {data['missing_years']}")
                else:
                    logger.warning(f"No {variable} data available")

            elif variable == "precipitation":
                data = await service.fetch_precipitation_data(lat, lon, month, day, start_year, end_year)

                if data["values"]:
                    stats = compute_statistics(data["values"])

                    probs = {}
                    if request.thresholds and variable in request.thresholds:
                        probs = compute_probabilities(data["values"], request.thresholds[variable])

                    historical_data[variable] = VariableData(
                        values=data["values"],
                        years=data["years"],
                        statistics=Statistics(**stats),
                        probabilities=probs
                    )

                    if data["actual_lat"] is not None and data["actual_lon"] is not None:
                        actual_grid_points[variable] = GridPoint(
                            lat=data["actual_lat"],
                            lon=data["actual_lon"],
                            dataset="GPM IMERG v07"
                        )

                    if data["missing_years"]:
                        missing_data[variable] = data["missing_years"]
                        logger.warning(f"Missing {variable} data for years: {data['missing_years']}")
                else:
                    logger.warning(f"No {variable} data available")

            elif variable == "wind_speed":
                data = await service.fetch_wind_data(lat, lon, month, day, start_year, end_year)

                if data["values"]:
                    stats = compute_statistics(data["values"])

                    probs = {}
                    if request.thresholds and variable in request.thresholds:
                        probs = compute_probabilities(data["values"], request.thresholds[variable])

                    historical_data[variable] = VariableData(
                        values=data["values"],
                        years=data["years"],
                        statistics=Statistics(**stats),
                        probabilities=probs
                    )

                    if data["actual_lat"] is not None and data["actual_lon"] is not None:
                        actual_grid_points[variable] = GridPoint(
                            lat=data["actual_lat"],
                            lon=data["actual_lon"],
                            dataset="MERRA-2 M2T1NXSLV"
                        )

                    if data["missing_years"]:
                        missing_data[variable] = data["missing_years"]
                        logger.warning(f"Missing {variable} data for years: {data['missing_years']}")
                else:
                    logger.warning(f"No {variable} data available")

            elif variable == "humidity":
                data = await service.fetch_humidity_data(lat, lon, month, day, start_year, end_year)

                if data["values"]:
                    stats = compute_statistics(data["values"])

                    probs = {}
                    if request.thresholds and variable in request.thresholds:
                        probs = compute_probabilities(data["values"], request.thresholds[variable])

                    historical_data[variable] = VariableData(
                        values=data["values"],
                        years=data["years"],
                        statistics=Statistics(**stats),
                        probabilities=probs
                    )

                    if data["actual_lat"] is not None and data["actual_lon"] is not None:
                        actual_grid_points[variable] = GridPoint(
                            lat=data["actual_lat"],
                            lon=data["actual_lon"],
                            dataset="MERRA-2 M2T1NXSLV"
                        )

                    if data["missing_years"]:
                        missing_data[variable] = data["missing_years"]
                        logger.warning(f"Missing {variable} data for years: {data['missing_years']}")
                else:
                    logger.warning(f"No {variable} data available")

            else:
                logger.warning(f"Unknown variable: {variable}")

        # Build query info
        day_of_year_str = f"{month_name[month]} {day}"

        query_info = QueryInfo(
            requested_location=request.location,
            actual_grid_points=actual_grid_points,
            day_of_year=day_of_year_str,
            years_analyzed=end_year - start_year + 1,
            data_period=f"{start_year}-{end_year}",
            missing_data=missing_data if missing_data else None
        )

        # Build metadata
        metadata = Metadata(
            data_sources={
                "temperature": DataSource(
                    name="MERRA-2 M2SDNXSLV v5.12.4",
                    url="https://disc.gsfc.nasa.gov/datasets/M2SDNXSLV_5.12.4/summary"
                ),
                "precipitation": DataSource(
                    name="GPM IMERG Final v07",
                    url="https://gpm.nasa.gov/data/imerg"
                )
            },
            units={
                "temperature": "celsius",
                "precipitation": "mm/day",
                "wind_speed": "m/s",
                "humidity": "percent"
            }
        )

        response = WeatherQueryResponse(
            query_info=query_info,
            historical_data=historical_data,
            metadata=metadata
        )

        logger.info(f"Successfully processed query")
        return response

    except ValueError as e:
        # Client errors (bad input)
        logger.warning(f"Invalid request: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Unexpected errors
        logger.error(f"Unexpected error processing weather query: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
