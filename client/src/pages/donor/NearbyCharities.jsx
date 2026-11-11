import React, { useState, useEffect } from 'react';
import { recommendationService } from '../../services/recommendationService';
import { useGeolocation } from '../../hooks/useGeolocation';
import GoogleMapComponent from '../../components/common/GoogleMapComponent';
import {
  Compass,
  MapPin,
  Building2,
  Phone,
  Navigation,
  Clock,
  Users,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const NearbyCharities = () => {
  const { coordinates, requestLocation, hasPermission } = useGeolocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'charity', 'public'
  const [radius, setRadius] = useState(25);
  const [search, setSearch] = useState('');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      if (activeTab === 'public') {
        const res = await recommendationService.getPublicPlaces({
          lat: coordinates.lat,
          lng: coordinates.lng,
          radius
        });
        setItems(res.data.map((p) => ({ ...p, recommendationType: 'PUBLIC_DISTRIBUTION_POINT' })));
      } else if (activeTab === 'charity') {
        const res = await recommendationService.getCommunityPlaces({
          lat: coordinates.lat,
          lng: coordinates.lng,
          radius
        });
        setItems(res.data.map((c) => ({ ...c, recommendationType: 'COMMUNITY_ORGANIZATION' })));
      } else {
        const res = await recommendationService.getCombinedNearby({
          lat: coordinates.lat,
          lng: coordinates.lng,
          radius
        });
        setItems(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [coordinates.lat, coordinates.lng, radius, activeTab]);

  const filteredItems = items.filter((item) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const name = (item.organizationName || item.name || '').toLowerCase();
    const addr = (item.address || '').toLowerCase();
    return name.includes(term) || addr.includes(term);
  });

  // Prepare markers for GoogleMapComponent
  const mapMarkers = filteredItems
    .filter((item) => item.location?.coordinates?.length === 2)
    .map((item) => ({
      id: item._id,
      lat: item.location.coordinates[1],
      lng: item.location.coordinates[0],
      title: item.organizationName || item.name,
      snippet: `${item.distanceKm} km away • ${item.address}`,
      type: item.recommendationType === 'PUBLIC_DISTRIBUTION_POINT' ? 'PUBLIC' : 'CHARITY',
      distanceKm: item.distanceKm,
      directionsUrl: item.googleMapsDirectionsUrl
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            GPS Proximity Matching
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Nearby Charities & Distribution Hubs</h1>
          <p className="text-xs text-slate-500">
            Discover verified NGOs, shelters, and public civic food points within proximity radius.
          </p>
        </div>

        <button
          onClick={requestLocation}
          className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
        >
          <Compass className="w-4 h-4 text-brand-600" />
          <span>{hasPermission ? 'GPS Active' : 'Refresh My GPS Location'}</span>
        </button>
      </div>

      {/* Map Radar View */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
        <GoogleMapComponent
          center={{ lat: coordinates.lat, lng: coordinates.lng }}
          zoom={12}
          markers={mapMarkers}
          height="320px"
        />
      </div>

      {/* Controls & Tab Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Recommendations ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('charity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'charity' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Charities & Shelters
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'public' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Public Distribution Points
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Radius Selector */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Radius:</span>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="text-xs rounded-xl border border-slate-200 px-2.5 py-1.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50/50 font-semibold"
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter names..."
              className="w-full text-xs rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {loading ? (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400">
          Scanning nearby distribution locations...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No Nearby Places Detected within {radius} km</h4>
          <p className="text-xs text-slate-400">Try expanding the proximity radius filter above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isPublic = item.recommendationType === 'PUBLIC_DISTRIBUTION_POINT';
            const title = item.organizationName || item.name;
            const subtitle = item.organizationType || item.placeType;

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-2.5 rounded-xl font-bold ${
                        isPublic ? 'bg-teal-50 text-teal-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {isPublic ? <MapPin className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {subtitle}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{title}</h4>
                      </div>
                    </div>
                    {item.distanceKm !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {item.distanceKm} km
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.description || 'Verified distribution partner center.'}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{item.address}</span>
                    </div>

                    {item.operatingHours && (
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>Hours: {item.operatingHours}</span>
                      </div>
                    )}

                    {item.peopleServed && (
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>Beneficiaries: ~{item.peopleServed} daily</span>
                      </div>
                    )}

                    {(item.contactPhone || item.contactPerson) && (
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{item.contactPhone || item.contactPerson}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified
                  </span>

                  {item.googleMapsDirectionsUrl && (
                    <a
                      href={item.googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center space-x-1 transition"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Directions</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NearbyCharities;
