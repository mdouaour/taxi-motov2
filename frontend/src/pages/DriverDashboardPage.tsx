import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Ride {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  distance: number;
  fare: number;
  status: string;
  rider: { name: string; email: string };
  createdAt: string;
}

const DriverDashboardPage: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleAcceptRide = async (rideId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/rides/${rideId}/accept`);
      fetchRides(); // Refresh ride list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept ride');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRideStatus = async (rideId: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/rides/${rideId}/status`, { status });
      fetchRides(); // Refresh ride list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update ride status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Driver Dashboard</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Available Rides / My Accepted Rides</h2>
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
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rider</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pickup</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dropoff</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fare (DZD)</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride) => (
                  <tr key={ride._id}>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.rider.name} ({ride.rider.email})</td>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.pickupLocation}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.dropoffLocation}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.fare.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{ride.status}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {ride.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptRide(ride._id)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                          disabled={loading}
                        >
                          Accept
                        </button>
                      )}
                      {ride.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateRideStatus(ride._id, 'pickedUp')}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                          disabled={loading}
                        >
                          Picked Up
                        </button>
                      )}
                      {ride.status === 'pickedUp' && (
                        <button
                          onClick={() => handleUpdateRideStatus(ride._id, 'droppedOff')}
                          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                          disabled={loading}
                        >
                          Dropped Off
                        </button>
                      )}
                      {ride.status === 'droppedOff' && (
                        <button
                          onClick={() => handleUpdateRideStatus(ride._id, 'completed')}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-sm"
                          disabled={loading}
                        >
                          Complete
                        </button>
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

export default DriverDashboardPage;
