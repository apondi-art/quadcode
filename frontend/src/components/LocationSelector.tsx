'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

interface Suggestion {
  lat: string;
  lon: string;
  display_name: string;
}

export default function LocationSelector({ location, onLocationChange }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState(location.name || '');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for location autocomplete
  useEffect(() => {
    // Don't search if we just selected something
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    if (searchQuery.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
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
        setIsOpen(data.length > 0);
      } catch (error) {
        console.error('Geocoding error:', error);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
    isSelectingRef.current = true;

    const newLocation: Location = {
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
      name: suggestion.display_name,
    };

    // Update everything in the right order
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    setIsOpen(false);
    onLocationChange(newLocation);
  }, [onLocationChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-search">Location</Label>
        <div className="relative" ref={dropdownRef}>
          <Input
            id="location-search"
            type="text"
            placeholder="Enter location (e.g., Nairobi, Kenya)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isOpen && suggestions.length > 0 && (
            <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
              <div className="p-1">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-accent cursor-pointer rounded-sm text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSuggestionClick(suggestion);
                    }}
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
