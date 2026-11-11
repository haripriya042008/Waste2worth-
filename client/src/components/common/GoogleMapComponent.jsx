import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';

const GoogleMapComponent = ({
  center = { lat: 12.9716, lng: 77.5946 },
  zoom = 13,
  markers = [],
  height = '400px',
  onMarkerClick
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      return;
    }

    // Check if script already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        console.warn('Google Maps script failed to load. Falling back to radar canvas.');
        setMapLoaded(false);
      };
      document.head.appendChild(script);
    }
  }, [apiKey]);

  useEffect(() => {
    if (mapLoaded && mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: center.lat, lng: center.lng },
        zoom: zoom,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'simplified' }] }
        ]
      });

      // User location marker
      new window.google.maps.Marker({
        position: { lat: center.lat, lng: center.lng },
        map: map,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: '#ffffff'
        }
      });

      // Other markers
      markers.forEach((m) => {
        if (!m.lat || !m.lng) return;
        const marker = new window.google.maps.Marker({
          position: { lat: m.lat, lng: m.lng },
          map: map,
          title: m.title || 'Location'
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: sans-serif; max-width: 220px;">
              <h4 style="font-weight: 600; margin: 0 0 4px 0; color: #166534;">${m.title}</h4>
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569;">${m.snippet || ''}</p>
              ${m.directionsUrl ? `<a href="${m.directionsUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; font-size: 12px; text-decoration: underline;">Get Directions &rarr;</a>` : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          if (onMarkerClick) onMarkerClick(m);
        });
      });
    }
  }, [mapLoaded, center, zoom, markers, onMarkerClick]);

  // If Google Maps API is loaded and key present, render actual Google Map container
  if (apiKey && mapLoaded) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <div ref={mapRef} style={{ width: '100%', height }} />
      </div>
    );
  }

  // Interactive Visual GIS Radar & Locations Canvas (Zero external dependency fallback)
  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-inner flex flex-col justify-between" style={{ height }}>
      {/* Top Map Header Controls */}
      <div className="p-4 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            GPS Radar & Proximity Map
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span className="flex items-center">
            <Compass className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {center.lat.toFixed(4)}° N, {center.lng.toFixed(4)}° E
          </span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-brand-400 hover:text-brand-300 font-medium"
          >
            Google Maps <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Visual Map Canvas Grid with Markers */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-6">
        {/* Concentric radar rings */}
        <div className="absolute w-72 h-72 rounded-full border border-emerald-500/10 animate-ping opacity-20 pointer-events-none"></div>
        <div className="absolute w-96 h-96 rounded-full border border-slate-800 pointer-events-none"></div>
        <div className="absolute w-64 h-64 rounded-full border border-slate-800/80 pointer-events-none"></div>
        <div className="absolute w-32 h-32 rounded-full border border-emerald-500/30 pointer-events-none"></div>
        <div className="absolute inset-x-0 h-px bg-slate-800 pointer-events-none"></div>
        <div className="absolute inset-y-0 w-px bg-slate-800 pointer-events-none"></div>

        {/* Center marker (You) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <div className="absolute -inset-1 rounded-full bg-blue-500/40 animate-ping"></div>
          </div>
          <span className="mt-1 text-[11px] font-semibold bg-slate-800/90 text-blue-300 px-2 py-0.5 rounded shadow">
            Your Location
          </span>
        </div>

        {/* Markers plotted relative to center */}
        {markers.map((marker, idx) => {
          // Normalize lat/lng offsets to fit in the box
          const dLat = (marker.lat - center.lat) * 2000;
          const dLng = (marker.lng - center.lng) * 2000;
          // Clamp offsets within box
          const clampX = Math.max(-160, Math.min(160, dLng));
          const clampY = Math.max(-120, Math.min(120, -dLat));

          const isSelected = selectedMarker?.id === marker.id || selectedMarker?.title === marker.title;

          return (
            <div
              key={idx}
              className="absolute z-20 cursor-pointer group"
              style={{
                transform: `translate(${clampX}px, ${clampY}px)`
              }}
              onClick={() => {
                setSelectedMarker(marker);
                if (onMarkerClick) onMarkerClick(marker);
              }}
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={`p-1.5 rounded-full transition-transform transform group-hover:scale-125 ${
                    isSelected
                      ? 'bg-amber-500 ring-4 ring-amber-500/30'
                      : marker.type === 'PUBLIC'
                      ? 'bg-teal-500'
                      : 'bg-emerald-500'
                  } shadow-md`}
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="opacity-80 group-hover:opacity-100 transition-opacity mt-1">
                  <span className="text-[10px] whitespace-nowrap bg-slate-900/90 text-slate-200 px-1.5 py-0.5 rounded border border-slate-700 shadow max-w-[120px] truncate block">
                    {marker.title}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Marker Detail Drawer / Card */}
      {selectedMarker ? (
        <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between z-20">
          <div className="max-w-[70%]">
            <h5 className="text-sm font-semibold text-emerald-400 truncate">{selectedMarker.title}</h5>
            <p className="text-xs text-slate-300 truncate">{selectedMarker.snippet}</p>
            {selectedMarker.distanceKm && (
              <span className="text-[11px] text-amber-300 font-medium">
                {selectedMarker.distanceKm} km away
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {selectedMarker.directionsUrl && (
              <a
                href={selectedMarker.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-medium text-white flex items-center shadow"
              >
                <Navigation className="w-3.5 h-3.5 mr-1" />
                Directions
              </a>
            )}
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between z-10">
          <span>Click any marker to view details and Google Maps navigation</span>
          <span className="text-slate-500">{markers.length} nearby locations plotted</span>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;
