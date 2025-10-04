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
