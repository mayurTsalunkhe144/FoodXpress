import { useState, useCallback } from 'react';
import { authService } from '../services/authService.jsx';

export const useAuth = () => {
  const [user, setUser] = useState(authService.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(identifier, password);
      setUser(response);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerCustomer = useCallback(async (fullName, email, phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registerCustomer(fullName, email, phone, password);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerRestaurant = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registerRestaurant(
        data.restaurantName,
        data.email,
        data.phone,
        data.password,
        data.description,
        data.address,
        data.cityId,
        data.stateId
      );
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerAdmin = useCallback(async (fullName, email, phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registerAdmin(fullName, email, phone, password);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerDeliveryBoy = useCallback(async (fullName, email, phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registerDeliveryBoy(fullName, email, phone, password);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    registerCustomer,
    registerRestaurant,
    registerAdmin,
    registerDeliveryBoy,
    logout,
    isAuthenticated: authService.isAuthenticated()
  };
};
