#!/usr/bin/env python3
"""
Utility functions for weather data processing
"""

import numpy as np
from typing import List, Dict, Tuple, Optional
import logging

logger = logging.getLogger(__name__)


def compute_statistics(values: List[float]) -> Dict[str, Optional[float]]:
    """
    Compute statistical measures from a list of values.
    Handles missing values (NaN) gracefully by filtering them out.

    Args:
        values: List of numerical values (may contain NaN)

    Returns:
        Dictionary containing mean, median, std, min, max, percentiles, count
    """
    if not values:
        logger.warning("Empty values list provided to compute_statistics")
        return {
            "mean": None,
            "median": None,
            "std": None,
            "min": None,
            "max": None,
            "percentile_10": None,
            "percentile_25": None,
            "percentile_75": None,
            "percentile_90": None,
            "count": 0,
        }

    # Convert to numpy array and filter out NaN values
    arr = np.array(values, dtype=float)
    valid_arr = arr[~np.isnan(arr)]

    if len(valid_arr) == 0:
        logger.warning("All values are NaN in compute_statistics")
        return {
            "mean": None,
            "median": None,
            "std": None,
            "min": None,
            "max": None,
            "percentile_10": None,
            "percentile_25": None,
            "percentile_75": None,
            "percentile_90": None,
            "count": 0,
        }

    logger.info(f"Computing statistics for {len(valid_arr)} valid values")

    return {
        "mean": float(np.mean(valid_arr)),
        "median": float(np.median(valid_arr)),
        "std": float(np.std(valid_arr)),
        "min": float(np.min(valid_arr)),
        "max": float(np.max(valid_arr)),
        "percentile_10": float(np.percentile(valid_arr, 10)),
        "percentile_25": float(np.percentile(valid_arr, 25)),
        "percentile_75": float(np.percentile(valid_arr, 75)),
        "percentile_90": float(np.percentile(valid_arr, 90)),
        "count": len(valid_arr),
    }


def compute_probabilities(
    values: List[float],
    thresholds: Dict[str, float]
) -> Dict[str, float]:
    """
    Compute probabilities of values exceeding or falling below specified thresholds.
    Handles missing values (NaN) gracefully by filtering them out.

    Args:
        values: List of numerical values (may contain NaN)
        thresholds: Dictionary with threshold names and values

    Returns:
        Dictionary of probabilities (0.0 to 1.0)
    """
    if not values or not thresholds:
        logger.warning("Empty values or thresholds provided")
        return {}

    # Convert to numpy array and filter out NaN values
    arr = np.array(values, dtype=float)
    valid_arr = arr[~np.isnan(arr)]

    if len(valid_arr) == 0:
        logger.warning("All values are NaN in compute_probabilities")
        return {}

    probabilities = {}

    for name, threshold in thresholds.items():
        if name in ["hot", "wet", "windy", "humid"]:
            prob = float(np.sum(valid_arr > threshold) / len(valid_arr))
            probabilities[f"above_{threshold}"] = prob
        elif name in ["cold", "dry"]:
            prob = float(np.sum(valid_arr < threshold) / len(valid_arr))
            probabilities[f"below_{threshold}"] = prob
        else:
            prob = float(np.sum(valid_arr > threshold) / len(valid_arr))
            probabilities[f"above_{threshold}"] = prob

    return probabilities


def compute_trend_analysis(
    values: List[float],
    years: List[int]
) -> Dict[str, Optional[float]]:
    """
    Compute trend analysis using linear regression.

    Args:
        values: List of numerical values
        years: List of corresponding years

    Returns:
        Dictionary containing slope, intercept, r_squared, trend_direction, percent_change
    """
    if not values or not years or len(values) < 2:
        logger.warning("Insufficient data for trend analysis")
        return {
            "slope": None,
            "intercept": None,
            "r_squared": None,
            "trend_direction": None,
            "percent_change": None
        }

    # Convert to numpy arrays and filter out NaN
    arr_values = np.array(values, dtype=float)
    arr_years = np.array(years, dtype=float)

    # Filter out NaN values
    valid_mask = ~np.isnan(arr_values)
    valid_values = arr_values[valid_mask]
    valid_years = arr_years[valid_mask]

    if len(valid_values) < 2:
        logger.warning("Insufficient valid data points for trend analysis")
        return {
            "slope": None,
            "intercept": None,
            "r_squared": None,
            "trend_direction": None,
            "percent_change": None
        }

    # Perform linear regression: y = mx + b
    slope, intercept = np.polyfit(valid_years, valid_values, 1)

    # Calculate R-squared
    y_pred = slope * valid_years + intercept
    ss_res = np.sum((valid_values - y_pred) ** 2)
    ss_tot = np.sum((valid_values - np.mean(valid_values)) ** 2)
    r_squared = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0.0

    # Determine trend direction
    if abs(slope) < 0.01 or r_squared < 0.1:
        trend_direction = "stable"
    elif slope > 0:
        trend_direction = "increasing"
    else:
        trend_direction = "decreasing"

    # Calculate percent change from first to last year
    first_value = valid_values[0]
    last_value = valid_values[-1]
    percent_change = ((last_value - first_value) / first_value * 100) if first_value != 0 else None

    logger.info(f"Trend analysis: slope={slope:.4f}, r²={r_squared:.4f}, direction={trend_direction}")

    return {
        "slope": float(slope),
        "intercept": float(intercept),
        "r_squared": float(r_squared),
        "trend_direction": trend_direction,
        "percent_change": float(percent_change) if percent_change is not None else None
    }


def compute_grid_offset(
    requested_lat: float,
    requested_lon: float,
    actual_lat: float,
    actual_lon: float
) -> Dict[str, float]:
    """
    Compute the offset distance between requested coordinates and actual grid point.
    Uses the Haversine formula for accurate distance calculation.

    Args:
        requested_lat: Requested latitude
        requested_lon: Requested longitude
        actual_lat: Actual grid point latitude
        actual_lon: Actual grid point longitude

    Returns:
        Dictionary containing offset_km, offset_lat, offset_lon
    """
    # Convert to radians
    lat1_rad = np.radians(requested_lat)
    lon1_rad = np.radians(requested_lon)
    lat2_rad = np.radians(actual_lat)
    lon2_rad = np.radians(actual_lon)

    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    a = np.sin(dlat / 2)**2 + np.cos(lat1_rad) * np.cos(lat2_rad) * np.sin(dlon / 2)**2
    c = 2 * np.arcsin(np.sqrt(a))

    # Earth's radius in kilometers
    earth_radius_km = 6371.0
    distance_km = earth_radius_km * c

    offset_lat = actual_lat - requested_lat
    offset_lon = actual_lon - requested_lon

    return {
        "offset_km": float(distance_km),
        "offset_lat": float(offset_lat),
        "offset_lon": float(offset_lon),
    }
