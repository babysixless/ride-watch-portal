
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/components/ui/use-toast";
import { Bus, LocateFixed, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface BusMapProps {
  className?: string;
  mapboxToken?: string;
}

// Mock bus data for demonstration
const MOCK_BUSES = [
  { id: 'bus-1', name: 'Bus #123', route: 'Downtown Express', lat: 40.7128, lng: -74.006, arrivalTime: '5 mins' },
  { id: 'bus-2', name: 'Bus #456', route: 'Airport Shuttle', lat: 40.7282, lng: -73.994, arrivalTime: '12 mins' },
  { id: 'bus-3', name: 'Bus #789', route: 'Uptown Local', lat: 40.7023, lng: -74.012, arrivalTime: '3 mins' },
];

// Default token - should be replaced with an environment variable in production
const DEFAULT_TOKEN = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbDVnbzMxbWsxNXJnM2Jxcjg1Z2NqM3BnIn0.I5H-c8R3OD2VzQdYwHbLWw';

export const BusMap = ({ className, mapboxToken }: BusMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const busMarkers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const { toast } = useToast();
  const [tokenError, setTokenError] = useState(false);
  const [customToken, setCustomToken] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              essential: true
            });
            
            toast({
              title: "Location found",
              description: "Your location has been updated on the map",
              duration: 3000,
            });
          }
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

  // Initialize map with token
  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;
    
    // Clean up existing map if any
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    try {
      setTokenError(false);
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.5, 40], // Default coordinates (New York area)
        zoom: 11
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Get user location and add bus markers on map load
      map.current.on('load', () => {
        setIsMapLoaded(true);
        getUserLocation();
        addBusMarkers();
      });
      
      // Handle error
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        if (e.error?.status === 401) {
          setTokenError(true);
          map.current?.remove();
          map.current = null;
        }
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setTokenError(true);
    }
  };

  // Add bus markers to the map
  const addBusMarkers = () => {
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
    });
  };

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

  // Initialize map on component mount
  useEffect(() => {
    const token = mapboxToken || DEFAULT_TOKEN;
    initializeMap(token);
    
    // Clean up on unmount
    return () => {
      // Remove all markers
      busMarkers.current.forEach(marker => marker.remove());
      if (userMarker.current) userMarker.current.remove();
      if (map.current) map.current.remove();
    };
  }, [mapboxToken]);

  // Apply custom token when provided
  const handleApplyToken = () => {
    if (customToken.trim()) {
      initializeMap(customToken.trim());
    }
  };

  return (
    <div className={`relative ${className}`}>
      {tokenError ? (
        <div className="bg-gray-100 rounded-lg p-4 h-full flex flex-col items-center justify-center text-center">
          <MapPin className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Mapbox Token Required</h3>
          <p className="mb-4 text-muted-foreground">Please enter a valid Mapbox access token to display the map</p>
          
          <div className="w-full max-w-md space-y-2 mb-4">
            <input 
              type="text"
              placeholder="Enter your Mapbox token" 
              className="w-full p-2 border rounded-md"
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
            />
            <Button onClick={handleApplyToken} className="w-full">
              Apply Token
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Get your free token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a> by signing up and viewing your access tokens in the account dashboard.
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
