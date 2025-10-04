#!/usr/bin/env python3
"""
Extract MERRA-2 temperature data for Nyeri, Kenya via OPeNDAP (streaming, no download)
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

    print("\nSearching for MERRA-2 daily temperature data for August 2024...")
    # Use MERRA-2 daily statistically-averaged dataset (much smaller than hourly)
    results = earthaccess.search_data(
        short_name="M2SDNXSLV",
        version="5.12.4",
        temporal=('2024-08-01', '2024-08-31'),
    )

    print(f"Found {len(results)} granule(s)")

    if len(results) > 0:
        print(f"\nFirst result: {results[0]}")

        print("\nOpening dataset via OPeNDAP (streaming)...")
        # Open the dataset using OPeNDAP - no download required
        files = earthaccess.open(results)
        ds = xr.open_mfdataset(files, decode_times=True, combine='nested', concat_dim='time')

        print(f"\nDataset covers {len(ds.time)} time steps")
        print("\nAvailable variables:")
        print(list(ds.data_vars.keys())[:10])  # Show first 10 variables

        # Select 2-meter air temperature (T2MMEAN for daily mean)
        if 'T2MMEAN' in ds.data_vars:
            temp_var = 'T2MMEAN'
        elif 'T2M' in ds.data_vars:
            temp_var = 'T2M'
        elif 'T10M' in ds.data_vars:
            temp_var = 'T10M'
        else:
            print(f"\nAvailable temperature variables: {[v for v in ds.data_vars if 'T' in v]}")
            temp_var = 'T2MMEAN'  # Default fallback

        print(f"\nExtracting {temp_var} data for Nyeri, Kenya (lat: {nyeri_lat}, lon: {nyeri_lon})...")

        # Select nearest grid point to Nyeri coordinates
        temp_nyeri = ds[temp_var].sel(lat=nyeri_lat, lon=nyeri_lon, method='nearest')

        # Get actual coordinates
        actual_lat = float(temp_nyeri.lat.values)
        actual_lon = float(temp_nyeri.lon.values)

        # MERRA-2 temperature is in Kelvin, convert to Celsius
        temps_kelvin = temp_nyeri.values
        temps_celsius = temps_kelvin - 273.15

        # Create DataFrame
        # If hourly data, compute daily mean
        times = pd.to_datetime(temp_nyeri.time.values)

        if len(times) > 31:  # Hourly or sub-daily data
            print(f"  Computing daily mean from {len(times)} hourly values...")
            df_hourly = pd.DataFrame({
                'datetime': times,
                'temperature_celsius': temps_celsius
            })
            df = df_hourly.groupby(df_hourly['datetime'].dt.date).agg({
                'temperature_celsius': 'mean'
            }).reset_index()
            df.columns = ['date', 'temperature_celsius']
        else:  # Already daily data
            df = pd.DataFrame({
                'date': times,
                'temperature_celsius': temps_celsius
            })

        # Save to CSV
        output_file = 'nyeri_temperature_august_2024.csv'
        df.to_csv(output_file, index=False)

        print(f"\n✓ Successfully extracted temperature data!")
        print(f"  Requested location: Nyeri, Kenya ({nyeri_lat}, {nyeri_lon})")
        print(f"  Nearest grid point: ({actual_lat}, {actual_lon})")
        print(f"  Period: August 2024")
        print(f"  Data points: {len(df)}")
        print(f"  Saved to: {output_file}")

        # Display summary statistics
        print(f"\nSummary (2-meter air temperature):")
        print(f"  Average temperature: {df['temperature_celsius'].mean():.2f} °C")
        print(f"  Max temperature: {df['temperature_celsius'].max():.2f} °C")
        print(f"  Min temperature: {df['temperature_celsius'].min():.2f} °C")

        ds.close()

    else:
        print("\nNo data found for the specified parameters.")

if __name__ == "__main__":
    main()
