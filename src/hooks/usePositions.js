import { useCallback, useEffect } from "react";
import positionService from "../services/positionService";
import { useResource } from "./useResource";

/**
 * Custom hook to fetch and manage paginated job positions.
 * @param {object} initialParams - Initial pagination parameters
 */
export const usePositions = (initialParams = {}) => {
  const { page = 1, limit = 10 } = initialParams;

  // If initialParams is scalar (backward compat check? No, let's assume object or update calls)
  // Actually, usePositions(1, 100) was called in ApplicationManagementPage.
  // I need to support (page, limit) arguments OR object?
  // Or update ApplicationManagementPage to pass object. 
  // ApplicationManagementPage: usePositions(1, 100) -> NO, it was `usePositions(1, 100)`.
  // I must be careful.
  
  // Let's support both for safety or just update the call site.
  // ApplicationManagementPage call site: `const { positions: allPositions = [] } = usePositions(1, 100);`
  // I should update that call site too.
  
  const fetcher = useCallback((params) => positionService.getAll(params), []);

  const resource = useResource(fetcher, { page, limit });
  const {
      data: positions,
      loading,
      pagination: { totalPages, totalItems },
      refresh
  } = resource;

  return {
    positions: positions || [],
    loading,
    totalPages,
    totalPositions: totalItems,
    refetchPositions: refresh,
    resource
  };
};
