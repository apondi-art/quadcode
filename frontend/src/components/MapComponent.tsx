'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/types/weather';

interface MapComponentProps {
  location: Location;
  onLocationChange: (location: Location) => void;
}

export default function MapComponent({ location, onLocationChange }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([location.lat, location.lon], 6);

      // Dark theme tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add click handler
      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        onLocationChange({
          lat: e.latlng.lat,
          lon: e.latlng.lng,
          name: location.name,
        });
      });
    }

    // Update marker position
    if (markerRef.current) {
      markerRef.current.setLatLng([location.lat, location.lon]);
    } else if (mapRef.current) {
      // Fix for default marker icon in Next.js
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      markerRef.current = L.marker([location.lat, location.lon], { icon }).addTo(mapRef.current);
    }

    // Center map on location
    mapRef.current?.setView([location.lat, location.lon]);

    return () => {
      // Cleanup is handled by component unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.lat, location.lon]);

  return <div ref={mapContainerRef} className="h-64 rounded-md border border-border" />;
}
