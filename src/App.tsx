import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map } from './components/Map';
import { Globe2, Search } from 'lucide-react';
import type { IPLocation } from './types';

function App() {
  const [ipAddress, setIpAddress] = useState('');
  const [locations, setLocations] = useState<IPLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIPLocation = async (ip: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);
      const newLocation: IPLocation = {
        ip: response.data.ip,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        country: response.data.country_name,
        city: response.data.city
      };
      setLocations(prev => [...prev, newLocation]);
    } catch (err) {
      setError('Failed to fetch IP location. Please try a valid IP address.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ipAddress) {
      fetchIPLocation(ipAddress);
      setIpAddress('');
    }
  };

  // Fetch user's IP on load
  useEffect(() => {
    const fetchUserIP = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        fetchIPLocation(response.data.ip);
      } catch (err) {
        setError('Failed to fetch your IP location.');
      }
    };
    fetchUserIP();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Globe2 className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">IP World Map</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Enter IP address..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Track IP
            </button>
          </div>
        </form>

        {error && (
          <div className="max-w-xl mx-auto mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Map locations={locations} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tracked IP Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div
                key={location.ip}
                className="bg-white p-4 rounded-lg shadow border border-gray-100"
              >
                <p className="font-bold text-lg">{location.ip}</p>
                <p className="text-gray-600">
                  {location.city}, {location.country}
                </p>
                <p className="text-sm text-gray-500">
                  {location.latitude}, {location.longitude}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;