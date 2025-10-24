import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Driver {
  _id: string;
  user: { _id: string; name: string; email: string };
  licenseNumber: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleRegistrationNumber: string;
  isVerified: boolean;
}

interface PromoCode {
  _id: string;
  code: string;
  discount: number;
  expirationDate: string;
  isActive: boolean;
}

interface Ride {
  _id: string;
  rider: { _id: string; name: string; email: string };
  driver?: { _id: string; user: { name: string } };
  pickupLocation: string;
  dropoffLocation: string;
  distance: number;
  fare: number;
  status: string;
  promoCode?: string;
  createdAt: string;
}

const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User Management States
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Rider');

  // Promo Code Management States
  const [newPromoCodeCode, setNewPromoCodeCode] = useState('');
  const [newPromoCodeDiscount, setNewPromoCodeDiscount] = useState<number | ''>('');
  const [newPromoCodeExpirationDate, setNewPromoCodeExpirationDate] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, driversRes, promoCodesRes, ridesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/drivers'),
        api.get('/admin/promocodes'),
        api.get('/rides/myrides'), // Admin can see all rides via this endpoint
      ]);
      setUsers(usersRes.data);
      setDrivers(driversRes.data);
      setPromoCodes(promoCodesRes.data);
      setRides(ridesRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // User Management Handlers
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/users', { name: newUserName, email: newUserEmail, password: newUserPassword, role: newUserRole });
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('Rider');
      fetchAllData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchAllData();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  // Driver Management Handlers
  const handleVerifyDriver = async (driverId: string, isVerified: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/admin/drivers/${driverId}/verify`, { isVerified });
      fetchAllData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update driver verification status');
    } finally {
      setLoading(false);
    }
  };

  // Promo Code Management Handlers
  const handleCreatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/promocodes', { code: newPromoCodeCode, discount: newPromoCodeDiscount, expirationDate: newPromoCodeExpirationDate });
      setNewPromoCodeCode('');
      setNewPromoCodeDiscount('');
      setNewPromoCodeExpirationDate('');
      fetchAllData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create promo code');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromoCode = async (promoCodeId: string) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/admin/promocodes/${promoCodeId}`);
        fetchAllData();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete promo code');
      } finally {
        setLoading(false);
      }
    }
  };

  // Ride Management Handlers
  const handleDeleteRide = async (rideId: string) => {
    if (window.confirm('Are you sure you want to delete this ride?')) {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/admin/rides/${rideId}`);
        fetchAllData();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete ride');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

      {loading && <p className="text-center text-blue-500">Loading data...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* User Management */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <form onSubmit={handleCreateUser} className="mb-4 p-4 border rounded-md">
          <h3 className="text-xl font-medium mb-2">Create New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newUserRole" className="block text-gray-700 text-sm font-bold mb-2">Role</label>
            <select
              id="newUserRole"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <option value="Rider">Rider</option>
              <option value="Driver">Driver</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            Create User
          </button>
        </form>

        <h3 className="text-xl font-medium mb-2">All Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{user._id}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.role}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Management */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Driver Management</h2>
        <h3 className="text-xl font-medium mb-2">All Drivers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User Name</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">License</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Verified</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{driver._id}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{driver.user.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{driver.licenseNumber}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{driver.vehicleModel} ({driver.vehicleColor})</td>
                  <td className="py-2 px-4 border-b border-gray-200">{driver.isVerified ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {!driver.isVerified && (
                      <button
                        onClick={() => handleVerifyDriver(driver._id, true)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                        disabled={loading}
                      >
                        Verify
                      </button>
                    )}
                    {driver.isVerified && (
                      <button
                        onClick={() => handleVerifyDriver(driver._id, false)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                        disabled={loading}
                      >
                        Unverify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promo Code Management */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Promo Code Management</h2>
        <form onSubmit={handleCreatePromoCode} className="mb-4 p-4 border rounded-md">
          <h3 className="text-xl font-medium mb-2">Create New Promo Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Code"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPromoCodeCode}
              onChange={(e) => setNewPromoCodeCode(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Discount (%)"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPromoCodeDiscount}
              onChange={(e) => setNewPromoCodeDiscount(parseFloat(e.target.value))}
              required
              min="0"
              max="100"
            />
            <input
              type="date"
              placeholder="Expiration Date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPromoCodeExpirationDate}
              onChange={(e) => setNewPromoCodeExpirationDate(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            Create Promo Code
          </button>
        </form>

        <h3 className="text-xl font-medium mb-2">All Promo Codes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount (%)</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expires</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Active</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => (
                <tr key={promo._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{promo._id}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{promo.code}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{promo.discount}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(promo.expirationDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{promo.isActive ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      onClick={() => handleDeletePromoCode(promo._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ride Management */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Ride Management</h2>
        <h3 className="text-xl font-medium mb-2">All Rides</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rider</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Driver</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pickup</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dropoff</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fare</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride) => (
                <tr key={ride._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{ride._id}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ride.rider.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ride.driver?.user.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ride.pickupLocation}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ride.dropoffLocation}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ride.fare.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{ride.status}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      onClick={() => handleDeleteRide(ride._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
