export interface Location {
  lat: number;
  lon: number;
  name?: string;
}

export interface DayOfYear {
  month: number;
  day: number;
}

export interface HistoricalYears {
  start_year: number;
  end_year: number;
}

export interface Thresholds {
  temperature?: {
    hot?: number;
    cold?: number;
  };
  precipitation?: {
    wet?: number;
  };
  wind_speed?: {
    windy?: number;
  };
  humidity?: {
    high?: number;
    low?: number;
  };
}

export interface WeatherQueryRequest {
  location: Location;
  day_of_year: DayOfYear;
  historical_years: HistoricalYears;
  variables: string[];
  thresholds?: Thresholds;
}

export interface Statistics {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  percentile_25: number;
  percentile_75: number;
  percentile_10?: number;
  percentile_90?: number;
  count?: number;
}

export interface Probabilities {
  [key: string]: number;
}

export interface VariableData {
  values: number[];
  years: number[];
  statistics: Statistics;
  probabilities: Probabilities;
}

export interface GridPoint {
  lat: number;
  lon: number;
  dataset: string;
}

export interface QueryInfo {
  requested_location: Location;
  actual_grid_points: {
    [key: string]: GridPoint;
  };
  day_of_year: string;
  years_analyzed: number;
  data_period: string;
}

export interface DataSource {
  name: string;
  url: string;
}

export interface Metadata {
  data_sources: {
    [key: string]: DataSource;
  };
  units: {
    [key: string]: string;
  };
}

export interface WeatherQueryResponse {
  query_info: QueryInfo;
  historical_data: {
    [key: string]: VariableData;
  };
  metadata: Metadata;
}

export interface WeatherVariable {
  id: string;
  name: string;
  description: string;
  unit: string;
  dataset: string;
  available_from: string;
}

export interface VariablesResponse {
  variables: WeatherVariable[];
}
