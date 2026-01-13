import { useState, useCallback } from "react";
import { 
  addOrUpdateService, 
  getServices, 
  getServiceByTitle, 
  deleteService as apiDeleteService 
} from "../services/servicesApi";
import { useResource } from "./useResource";

export const useServices = (initialParams = {}) => {
  const { page = 1, limit = 10 } = initialParams;

  // normalize response for useResource: { data, totalItems, totalPages }
  const fetcher = useCallback(async (params) => {
    const data = await getServices(params.page, params.limit);
    // data structure based on previous file: { services: [], page, limit, totalPages, total }
    return {
      data: data.services || [],
      totalPages: data.totalPages || 1,
      totalItems: data.total || 0
    };
  }, []);

  const resource = useResource(fetcher, { page, limit });
  const { 
    data: services, 
    loading, 
    error, 
    pagination, 
    refresh,
    setError 
  } = resource;

  const [service, setService] = useState(null);

  const fetchServiceByTitle = useCallback(async (title) => {
    // We can keep this separate as it fetches a single item
    try {
      const data = await getServiceByTitle(title);
      setService(data);
      return data;
    } catch (err) {
      setError(err.message || `Failed to fetch service: ${title}`);
      setService(null);
    }
  }, [setError]);

  const saveService = useCallback(async (formData) => {
    try {
      const data = await addOrUpdateService(formData);
      setService(data);
      refresh(); // Refresh list after save
      return data;
    } catch (err) {
      setError(err.message || "Failed to save service.");
      throw err;
    }
  }, [refresh, setError]);

  const removeService = useCallback(async (title) => {
    try {
      const result = await apiDeleteService(title);
      refresh(); // Refresh list after delete
      return result;
    } catch (err) {
      setError(err.message || `Failed to delete service: ${title}`);
      throw err;
    }
  }, [refresh, setError]);

  return {
    services,
    service,
    loading,
    error,
    pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        total: pagination.totalItems // mapping totalItems to total for backward compat compatibility if needed, though we should prefer totalItems
    },
    fetchServices: refresh, // Map fetchServices to refresh for backward compatibility
    fetchServiceByTitle,
    saveService,
    removeService,
    setService,
    setError,
    resource // Expose full resource
  };
};