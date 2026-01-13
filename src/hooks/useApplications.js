import { useCallback, useEffect } from "react";
import applicationService from "../services/applicationService";
import { useResource } from "./useResource";

/**
 * Custom hook to fetch and manage paginated and filtered job applications.
 * Now acts as an autonomous resource hook.
 * 
 * @param {object} initialParams - Initial parameters (page, limit, status, positionId)
 * @returns {object} { applications, loading, resource, ... }
 */
export const useApplications = (initialParams = {}) => {
  // Destructure initial params with defaults
  const { page = 1, limit = 10, status = '', positionId = '' } = initialParams;

  const fetcher = useCallback((params) => applicationService.getAll(params), []);
  
  // Initialize useResource with initial values.
  const resource = useResource(fetcher, { page, limit, status, positionId });
  const { 
    data: applications, 
    loading, 
    pagination: { totalPages, totalItems }, 
    refresh,
    setFilters
  } = resource;

  // Sync ONLY filters from props (if they change).
  // We assume 'page' and 'limit' are now managed internally by useResource (via ResourceTable).
  // If the parent DOES pass a changing 'page' prop, it will be ignored after mount unless we sync it.
  // But for "Autonomous" mode, we usually don't want parent to drive page unless it's a specific need.
  // We will ONLY sync filters.
  
  useEffect(() => {
    // Only update if these specific filters change
    setFilters({ status, positionId });
  }, [status, positionId, setFilters]);

  // We return the flattened props for backward compatibility 
  // AND the full 'resource' object for the new ResourceTable
  return { 
    applications: applications || [], 
    loading, 
    totalPages, 
    totalApplications: totalItems, 
    refetchApplications: refresh,
    resource // The full resource object
  };
};
