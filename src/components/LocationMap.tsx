
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  height?: number;
  className?: string;
  interactive?: boolean;
}

const LocationMap: React.FC<LocationMapProps> = ({
  height = 400,
  className = '',
  interactive = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const [mapSettings, setMapSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapSettings = async () => {
      try {
        // Fetch map settings from database
        const { data, error } = await supabase
          .from('site_config')
          .select('*')
          .eq('key', 'map_settings')
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data && data.value) {
          setMapSettings(data.value);
        } else {
          // Set defaults if no settings found
          setMapSettings({
            mapbox_token: 'pk.placeholder',
            latitude: '19.0760',
            longitude: '72.8777',
            zoom: 12,
            map_style: 'mapbox://styles/mapbox/streets-v12',
            map_height: height,
            pin_title: 'Shree Bhagwati Caterers',
            pin_description: 'Premium Vegetarian Catering Services',
          });
        }
      } catch (err: any) {
        console.error('Error fetching map settings:', err);
        setError('Failed to load map settings');
      } finally {
        setLoading(false);
      }
    };

    fetchMapSettings();
  }, [height]);

  useEffect(() => {
    // Load Mapbox script dynamically to prevent issues with SSR
    if (!mapSettings || loading) return;

    const loadMapbox = async () => {
      try {
        if (!window.mapboxgl) {
          const mapboxScript = document.createElement('script');
          mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js';
          mapboxScript.async = true;
          document.body.appendChild(mapboxScript);

          const mapboxStyles = document.createElement('link');
          mapboxStyles.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
          mapboxStyles.rel = 'stylesheet';
          document.head.appendChild(mapboxStyles);

          await new Promise(resolve => {
            mapboxScript.onload = resolve;
          });
        }

        if (!mapContainer.current || map.current) return;

        const mapboxgl = window.mapboxgl;
        
        // Set access token
        mapboxgl.accessToken = mapSettings.mapbox_token;
        
        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: mapSettings.map_style || 'mapbox://styles/mapbox/streets-v12',
          center: [parseFloat(mapSettings.longitude), parseFloat(mapSettings.latitude)],
          zoom: mapSettings.zoom || 12,
          interactive: interactive,
        });

        // Add marker
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `<div class="flex items-center justify-center w-12 h-12 -mt-6 -ml-6 bg-bhagwati-maroon/90 text-white rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>`;

        marker.current = new mapboxgl.Marker(el)
          .setLngLat([parseFloat(mapSettings.longitude), parseFloat(mapSettings.latitude)])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<h3 class="text-base font-semibold">${mapSettings.pin_title}</h3>
                <p class="text-sm">${mapSettings.pin_description}</p>`
              )
          )
          .addTo(map.current);

        // Add navigation controls if interactive
        if (interactive) {
          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        }
        
        // Clean up on unmount
        return () => {
          if (map.current) {
            map.current.remove();
            map.current = null;
          }
        };
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize the map');
      }
    };

    loadMapbox();
  }, [mapSettings, loading, interactive]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} 
        style={{ height: `${height}px` }}
      >
        <div className="text-center p-4">
          <MapPin className="h-8 w-8 text-bhagwati-maroon mx-auto mb-2" />
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Please check your map configuration in settings</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} 
        style={{ height: `${height}px` }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bhagwati-gold"></div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className={`rounded-lg overflow-hidden shadow-md ${className}`}
      style={{ height: `${mapSettings?.map_height || height}px` }}
    />
  );
};

export default LocationMap;
