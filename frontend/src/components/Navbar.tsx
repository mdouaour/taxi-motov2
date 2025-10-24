import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Taxi-Moto</Link>
        <div className="space-x-4">
          {userInfo ? (
            <>
              {userInfo.role === 'Rider' && (
                <Link to="/rider-dashboard" className="text-gray-300 hover:text-white">Rider Dashboard</Link>
              )}
              {userInfo.role === 'Driver' && (
                <Link to="/driver-dashboard" className="text-gray-300 hover:text-white">Driver Dashboard</Link>
              )}
              {userInfo.role === 'Admin' && (
                <Link to="/admin-dashboard" className="text-gray-300 hover:text-white">Admin Dashboard</Link>
              )}
              <button onClick={logoutHandler} className="text-gray-300 hover:text-white bg-transparent border-none">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
              <Link to="/signup" className="text-gray-300 hover:text-white">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
