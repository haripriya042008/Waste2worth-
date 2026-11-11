import React, { useState, useEffect } from 'react';
import { recommendationService } from '../../services/recommendationService';
import { useGeolocation } from '../../hooks/useGeolocation';
import GoogleMapComponent from '../../components/common/GoogleMapComponent';
import {
  Compass,
  MapPin,
  Building2,
  Navigation,
  Clock,
  Phone,
  Search,
  Users
} from 'lucide-react';

const GPSRecommendations = () => {
  const { coordinates, requestLocation, hasPermission } = useGeolocation();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(25);
  const [placeType, setPlaceType] = useState('all');

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const res = await recommendationService.getPublicPlaces({
          lat: coordinates.lat,
          lng: coordinates.lng,
          radius,
          placeType
        });
        setPlaces(res.data || []);
      } catch (err) {
        console.error('Failed to load places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [coordinates.lat, coordinates.lng, radius, placeType]);

  const mapMarkers = places.map((p) => ({
    id: p._id,
    lat: p.location?.coordinates?.[1] || 12.9716,
    lng: p.location?.coordinates?.[0] || 77.5946,
    title: p.name,
    snippet: `${p.distanceKm} km away • ${p.address}`,
    type: 'PUBLIC',
    distanceKm: p.distanceKm,
    directionsUrl: p.googleMapsDirectionsUrl
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Civic Logistics Mapping
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Public Places & Food Hubs</h1>
          <p className="text-xs text-slate-500">
            Identify authorized municipal distribution points, community kitchens, and transit hub feeding centers.
          </p>
        </div>

        <button
          onClick={requestLocation}
          className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>{hasPermission ? 'GPS Locked' : 'Update GPS'}</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
        <GoogleMapComponent
          center={{ lat: coordinates.lat, lng: coordinates.lng }}
          zoom={12}
          markers={mapMarkers}
          height="320px"
        />
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-600">Place Type:</span>
          <select
            value={placeType}
            onChange={(e) => setPlaceType(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-1.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
          >
            <option value="all">All Facility Types</option>
            <option value="Community Center">Community Center</option>
            <option value="Public Distribution Point">Public Distribution Point</option>
            <option value="Community Kitchen">Community Kitchen</option>
            <option value="Municipal Shelter">Municipal Shelter</option>
            <option value="Transit Station Hub">Transit Station Hub</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-600">Radius:</span>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="text-xs rounded-xl border border-slate-200 px-3 py-1.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50"
          >
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
            <option value="50">Within 50 km</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400">
          Loading distribution places...
        </div>
      ) : places.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          No verified distribution points found within {radius} km.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {places.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">
                      {p.placeType}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                  </div>
                  {p.distanceKm !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {p.distanceKm} km
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>

                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <p className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{p.address}</span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{p.operatingHours}</span>
                  </p>
                  {p.contactPerson && (
                    <p className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{p.contactPerson} ({p.contactPhone})</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <a
                  href={p.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GPSRecommendations;
