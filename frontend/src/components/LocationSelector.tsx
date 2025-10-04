'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { Location } from '@/types/weather';

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-900 rounded-md animate-pulse" />,
});

interface LocationSelectorProps {
  location: Location;
  onLocationChange: (location: Location) => void;
}

export default function LocationSelector({ location, onLocationChange }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState(location.name || '');
  const [suggestions, setSuggestions] = useState<Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search for location autocomplete
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // Using Nominatim for geocoding (free OpenStreetMap service)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion: {
    lat: string;
    lon: string;
    display_name: string;
  }) => {
    const newLocation: Location = {
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
      name: suggestion.display_name,
    };
    onLocationChange(newLocation);
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-search">Location</Label>
        <div className="relative">
          <Input
            id="location-search"
            type="text"
            placeholder="Enter location (e.g., Nairobi, Kenya)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
              <div className="p-1">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-accent cursor-pointer rounded-sm text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="0.0001"
            value={location.lat}
            onChange={(e) => onLocationChange({ ...location, lat: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="0.0001"
            value={location.lon}
            onChange={(e) => onLocationChange({ ...location, lon: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <MapComponent location={location} onLocationChange={onLocationChange} />
    </div>
  );
}
