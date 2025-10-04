import {
  WeatherQueryRequest,
  WeatherQueryResponse,
  VariablesResponse,
} from '@/types/weather';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export class WeatherAPI {
  static async queryWeather(request: WeatherQueryRequest): Promise<WeatherQueryResponse> {
    const response = await fetch(`${API_BASE_URL}/weather/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async getVariables(): Promise<VariablesResponse> {
    const response = await fetch(`${API_BASE_URL}/weather/variables`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async downloadData(request: WeatherQueryRequest, format: 'csv' | 'json'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/weather/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...request, format }),
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    return response.blob();
  }

  static async healthCheck(): Promise<{ status: string; earthdata_authenticated: boolean }> {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }
}
