import { useState, useEffect } from 'react';

export const useGeolocation = (defaultCoords = { lat: 12.9716, lng: 77.5946 }) => {
  const [coordinates, setCoordinates] = useState(defaultCoords);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setError(null);
        setHasPermission(true);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Location permission denied. Using standard coordinates.');
        setHasPermission(false);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    // Attempt automatic geolocation on mount
    requestLocation();
  }, []);

  return { coordinates, setCoordinates, error, loading, hasPermission, requestLocation };
};
