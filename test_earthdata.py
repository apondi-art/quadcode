#!/usr/bin/env python3
"""
Extract GPM IMERG precipitation data for Nyeri, Kenya via OPeNDAP (streaming, no download)
"""

import earthaccess
import xarray as xr
import pandas as pd

def main():
    # Nyeri, Kenya coordinates (approximate center)
    nyeri_lat = -0.4197
    nyeri_lon = 36.9489

    print("Authenticating with Earthdata Login...")
    auth = earthaccess.login()

    print("\nSearching for GPM IMERG daily data for August 2024...")
    # Note: August 2025 data may not be available yet. Using August 2024 instead.
    # Search for daily IMERG data for entire month of August 2024
    results = earthaccess.search_data(
        short_name="GPM_3IMERGDF",
        version="07",
        temporal=('2024-08-01', '2024-08-31'),
    )

    print(f"Found {len(results)} granule(s) (one per day)")

    print("\nOpening dataset via OPeNDAP (streaming)...")
    # Open the dataset using OPeNDAP - no download required
    ds = earthaccess.open(results)
    ds = xr.open_mfdataset(ds, decode_times=True, combine='nested', concat_dim='time')

    print(f"Dataset covers {len(ds.time)} days")

    print(f"\nExtracting precipitation data for Nyeri, Kenya (lat: {nyeri_lat}, lon: {nyeri_lon})...")
    # Select the nearest grid point to Nyeri coordinates
    precip_nyeri = ds['precipitation'].sel(lat=nyeri_lat, lon=nyeri_lon, method='nearest')

    # Get the actual coordinates used (nearest grid point)
    actual_lat = float(precip_nyeri.lat.values)
    actual_lon = float(precip_nyeri.lon.values)

    # Create a DataFrame with dates and precipitation values
    data = {
        'date': pd.to_datetime(precip_nyeri.time.values),
        'precipitation_mm': precip_nyeri.values
    }
    df = pd.DataFrame(data)

    # Save to CSV
    output_file = 'nyeri_precipitation_august_2024.csv'
    df.to_csv(output_file, index=False)

    print(f"\n✓ Successfully extracted precipitation data!")
    print(f"  Requested location: Nyeri, Kenya ({nyeri_lat}, {nyeri_lon})")
    print(f"  Nearest grid point: ({actual_lat}, {actual_lon})")
    print(f"  Period: August 1-31, 2024")
    print(f"  Data points: {len(df)}")
    print(f"  Saved to: {output_file}")

    # Display summary statistics
    print(f"\nSummary:")
    print(f"  Total precipitation: {df['precipitation_mm'].sum():.2f} mm")
    print(f"  Average daily: {df['precipitation_mm'].mean():.2f} mm")
    print(f"  Max daily: {df['precipitation_mm'].max():.2f} mm")
    print(f"  Min daily: {df['precipitation_mm'].min():.2f} mm")

    # Close the dataset
    ds.close()

if __name__ == "__main__":
    main()
