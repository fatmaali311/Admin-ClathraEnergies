import { useState, useCallback } from "react";
import { 
  addOrUpdateService, 
  getServices, 
  getServiceByTitle, 
  deleteService as apiDeleteService 
} from "../services/servicesApi";

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({});
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError("");
    try {
      const data = await getServices(page, limit);
      setServices(data?.services || []);
      const { services: _, ...restPagination } = data;
      setPagination(restPagination);
    } catch (err) {
      setError(err.message || "Failed to fetch services.");
      setServices([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServiceByTitle = useCallback(async (title) => {
    setLoading(true);
    setError("");
    try {
      const data = await getServiceByTitle(title);
      setService(data);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch service: ${title}`);
      setService(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveService = useCallback(async (formData) => {
    setLoading(true);
    setError("");
    try {
      const data = await addOrUpdateService(formData);
      setService(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to save service.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeService = useCallback(async (title) => {
    setLoading(true);
    setError("");
    try {
      const result = await apiDeleteService(title);
      setServices(prev => prev.filter(s => s.title !== title));
      return result;
    } catch (err) {
      setError(err.message || `Failed to delete service: ${title}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    services,
    service,
    loading,
    error,
    pagination,
    fetchServices,
    fetchServiceByTitle,
    saveService,
    removeService,
    setService,
    setError
  };
};