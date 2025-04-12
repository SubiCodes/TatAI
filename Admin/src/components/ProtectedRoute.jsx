// Change your ProtectedRoute to check authentication differently
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { URI } from '../constants/URI.js';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${URI}auth/get-cookie`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (loading) {
    return (
        <div>
            Loading...
        </div>
    ); // Or a spinner
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;