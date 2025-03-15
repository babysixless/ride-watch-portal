
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface BusMapProps {
  className?: string;
}

export const BusMap = ({ className }: BusMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // In a real app, you would get this from your environment variables
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40], // Default coordinates
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up on unmount
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="map-container absolute inset-0 rounded-lg" />
    </div>
  );
};
