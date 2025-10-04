#!/usr/bin/env python3
"""
Pydantic models for weather API
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Optional
from enum import Enum
from datetime import datetime
import calendar


class Location(BaseModel):
    """Location coordinates and name"""
    lat: float = Field(..., description="Latitude", ge=-90, le=90)
    lon: float = Field(..., description="Longitude", ge=-180, le=180)
    name: Optional[str] = Field(None, description="Location name (e.g., 'Nyeri, Kenya')")


class WeatherVariable(str, Enum):
    """Available weather variables"""
    TEMPERATURE = "temperature"
    PRECIPITATION = "precipitation"
    WIND_SPEED = "wind_speed"
    HUMIDITY = "humidity"


class DayOfYear(BaseModel):
    """Day of year specification"""
    month: int = Field(..., description="Month (1-12)", ge=1, le=12)
    day: int = Field(..., description="Day of month", ge=1, le=31)

    @field_validator('day')
    @classmethod
    def validate_day(cls, v, info):
        """Validate that day is valid for the given month"""
        month = info.data.get('month')
        if month:
            max_day = calendar.monthrange(2000, month)[1]  # Use leap year for safety
            if v > max_day:
                raise ValueError(f"Day {v} is invalid for month {month}")
        return v


class HistoricalYears(BaseModel):
    """Historical year range"""
    start_year: int = Field(..., description="Start year", ge=1980)
    end_year: int = Field(..., description="End year")

    @field_validator('end_year')
    @classmethod
    def validate_end_year(cls, v, info):
        """Validate end year is not in the future and >= start_year"""
        current_year = datetime.now().year
        if v > current_year:
            raise ValueError(f"end_year cannot be greater than current year ({current_year})")

        start_year = info.data.get('start_year')
        if start_year and v < start_year:
            raise ValueError("end_year must be >= start_year")
        return v


class WeatherQueryRequest(BaseModel):
    """Request body for weather query endpoint"""
    location: Location
    day_of_year: DayOfYear
    historical_years: HistoricalYears
    variables: List[WeatherVariable] = Field(
        ...,
        description="List of variables to query",
        example=["temperature", "precipitation"]
    )
    thresholds: Optional[Dict[str, Dict[str, float]]] = Field(
        None,
        description="Thresholds for probability calculations",
        example={
            "temperature": {"hot": 35, "cold": 5},
            "precipitation": {"wet": 50}
        }
    )


class GridPoint(BaseModel):
    """Grid point information"""
    lat: float
    lon: float
    dataset: str


class Statistics(BaseModel):
    """Statistical measures"""
    mean: Optional[float]
    median: Optional[float]
    std: Optional[float]
    min: Optional[float]
    max: Optional[float]
    percentile_10: Optional[float]
    percentile_25: Optional[float]
    percentile_75: Optional[float]
    percentile_90: Optional[float]
    count: int


class VariableData(BaseModel):
    """Data for a single weather variable"""
    values: List[float]
    years: List[int]
    statistics: Statistics
    probabilities: Dict[str, float]


class QueryInfo(BaseModel):
    """Query metadata"""
    requested_location: Location
    actual_grid_points: Dict[str, GridPoint]
    day_of_year: str
    years_analyzed: int
    data_period: str
    missing_data: Optional[Dict[str, List[int]]] = Field(
        None,
        description="Years with missing data per variable"
    )


class DataSource(BaseModel):
    """Data source information"""
    name: str
    url: str


class Metadata(BaseModel):
    """Response metadata"""
    data_sources: Dict[str, DataSource]
    units: Dict[str, str]


class WeatherQueryResponse(BaseModel):
    """Response body for weather query endpoint"""
    query_info: QueryInfo
    historical_data: Dict[str, VariableData]
    metadata: Metadata
