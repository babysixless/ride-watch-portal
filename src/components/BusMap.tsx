
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/components/ui/use-toast";
import { Bus, LocateFixed } from 'lucide-react';
import { Button } from './ui/button';

interface BusMapProps {
  className?: string;
}

// Mock bus data for demonstration
const MOCK_BUSES = [
  { id: 'bus-1', name: 'Bus #123', route: 'Downtown Express', lat: 40.7128, lng: -74.006, arrivalTime: '5 mins' },
  { id: 'bus-2', name: 'Bus #456', route: 'Airport Shuttle', lat: 40.7282, lng: -73.994, arrivalTime: '12 mins' },
  { id: 'bus-3', name: 'Bus #789', route: 'Uptown Local', lat: 40.7023, lng: -74.012, arrivalTime: '3 mins' },
];

export const BusMap = ({ className }: BusMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const busMarkers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const { toast } = useToast();

  // Handle getting user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Getting your location...",
        duration: 2000,
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          // Center map on user location
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true
          });
          
          toast({
            title: "Location found",
            description: "Your location has been updated on the map",
            duration: 3000,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location error",
            description: "Could not access your location. Please check your settings.",
            variant: "destructive",
            duration: 5000,
          });
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Replace with your Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbDVnbzMxbWsxNXJnM2Jxcjg1Z2NqM3BnIn0.I5H-c8R3OD2VzQdYwHbLWw';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40], // Default coordinates (New York area)
      zoom: 11
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Get user location on map load
    map.current.on('load', () => {
      getUserLocation();
    });

    // Clean up on unmount
    return () => {
      // Remove all markers
      busMarkers.current.forEach(marker => marker.remove());
      if (userMarker.current) userMarker.current.remove();
      map.current?.remove();
    };
  }, []);

  // Update bus markers when map is ready
  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;

    // Remove any existing bus markers
    busMarkers.current.forEach(marker => marker.remove());
    busMarkers.current = [];

    // Add bus markers
    MOCK_BUSES.forEach(bus => {
      // Create custom bus marker element
      const el = document.createElement('div');
      el.className = 'bus-marker';
      
      // Create SVG for the bus icon
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '30');
      svg.setAttribute('height', '30');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', '#3b82f6');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      
      // Bus icon path (using Lucide Bus icon path data)
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M8 6v6m0 4v2M8 12h8m-8 0H6a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2m-4 0v4m0-4H6m6 0h6M6 16h12M4 20h16');
      
      svg.appendChild(path);
      el.appendChild(svg);
      
      // Add background circle for better visibility
      el.style.backgroundColor = 'white';
      el.style.borderRadius = '50%';
      el.style.padding = '5px';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Create and add the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([bus.lng, bus.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3 class="font-semibold">${bus.name}</h3>
              <p>${bus.route}</p>
              <p>Arriving in: ${bus.arrivalTime}</p>
            `)
        )
        .addTo(map.current!);
        
      busMarkers.current.push(marker);
      
      // Simulate bus movement every few seconds
      const moveInterval = setInterval(() => {
        if (!map.current) {
          clearInterval(moveInterval);
          return;
        }
        
        // Update position slightly (simulate movement)
        const newLng = bus.lng + (Math.random() - 0.5) * 0.005;
        const newLat = bus.lat + (Math.random() - 0.5) * 0.005;
        bus.lng = newLng;
        bus.lat = newLat;
        
        marker.setLngLat([newLng, newLat]);
      }, 3000);
      
      // Clean up interval on component unmount
      return () => clearInterval(moveInterval);
    });
  }, [map.current?.loaded()]);

  // Update user location marker when location changes
  useEffect(() => {
    if (!map.current || !map.current.loaded() || !userLocation) return;

    // Remove existing user marker if it exists
    if (userMarker.current) {
      userMarker.current.remove();
    }

    // Create custom user location marker element
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.style.backgroundColor = '#4ade80'; // Green background
    el.style.borderRadius = '50%';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.boxShadow = '0 0 0 5px rgba(74, 222, 128, 0.3)';
    
    // Create and add the user marker
    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat(userLocation)
      .addTo(map.current);
      
  }, [userLocation]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="map-container absolute inset-0 rounded-lg" />
      
      {/* Floating location button */}
      <div className="absolute right-4 top-4 z-10">
        <Button 
          variant="secondary" 
          size="icon"
          onClick={getUserLocation}
          className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
        >
          <LocateFixed className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
