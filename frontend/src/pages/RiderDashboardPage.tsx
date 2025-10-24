import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Ride {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: number;
  fare: number;
  status: string;
  promoCode?: string;
  createdAt: string;
}

const RiderDashboardPage: React.FC = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [distance, setDistance] = useState<number | ''>('');
  const [promoCode, setPromoCode] = useState('');
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rideRequestMessage, setRideRequestMessage] = useState<string | null>(null);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/rides/myrides');
      setRides(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleRequestRide = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRideRequestMessage(null);
    try {
      const { data } = await api.post('/rides', { pickupLocation, dropoffLocation, distance });
      setRideRequestMessage(`Ride requested! Fare: ${data.fare} DZD. Status: ${data.status}`);
      setPickupLocation('');
      setDropoffLocation('');
      setDistance('');
      fetchRides(); // Refresh ride list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request ride');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromoCode = async (rideId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/rides/${rideId}/apply-promo`, { promoCode });
      setRideRequestMessage('Promo code applied successfully!');
      setPromoCode('');
      fetchRides(); // Refresh ride list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to apply promo code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Rider Dashboard</h1>

      {/* Ride Request Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Request a New Ride</h2>
        <form onSubmit={handleRequestRide}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pickupLocation">
              Pickup Location
            </label>
            <input
              type="text"
              id="pickupLocation"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropoffLocation">
              Dropoff Location
            </label>
            <input
              type="text"
              id="dropoffLocation"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="distance">
              Distance (km)
            </label>
            <input
              type="number"
              id="distance"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value))}
              required
              min="0"
              step="0.1"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Requesting...' : 'Request Ride'}
            </button>
          </div>
          {rideRequestMessage && <p className="text-green-500 text-sm mt-4">{rideRequestMessage}</p>}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </form>
      </div>

      {/* Ride History */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">My Rides</h2>
        {loading ? (
          <p>Loading rides...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : rides.length === 0 ? (
          <p>No rides found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pickup</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dropoff</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Distance (km)</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fare (DZD)</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Promo Code</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride) => (
                  <tr key={ride._id}>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.pickupLocation}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.dropoffLocation}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.distance}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.fare.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.status}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.promoCode || 'N/A'}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {ride.status === 'pending' && !ride.promoCode && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Enter Promo Code"
                            className="shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                          />
                          <button
                            onClick={() => handleApplyPromoCode(ride._id)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                            disabled={loading || !promoCode}
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboardPage;
