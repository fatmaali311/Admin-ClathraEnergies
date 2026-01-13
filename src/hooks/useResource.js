import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Generic hook to manage resource fetching, pagination, and state.
 * 
 * @param {Function} fetchFunction - Async function to fetch data (e.g. service.getAll)
 * @param {object} initialParams - Initial parameters (page, limit, filters)
 * @param {boolean} autoFetch - Whether to fetch immediately on mount
 * @returns {object} { data, loading, error, pagination, actions }
 */
export const useResource = (fetchFunction, initialParams = { page: 1, limit: 10 }, autoFetch = true) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(initialParams.page || 1);
  const [limit, setLimit] = useState(initialParams.limit || 10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filter state (everything else besides page/limit)
  const [filters, setFilters] = useState(() => {
    const { page, limit, ...rest } = initialParams;
    return rest;
  });

  const [refreshToggle, setRefreshToggle] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit, ...filters };
      const response = await fetchFunction(params);

      // Handle standard response format: { data: [], totalPages: N, totalItems: M }
      if (response && response.data) {
        setData(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalItems(response.totalItems || 0);
      } else if (Array.isArray(response)) {
        // Fallback if API returns just array
        setData(response);
        setTotalPages(1);
        setTotalItems(response.length);
      } else {
        // Fallback for unexpected format
        setData([]);
      }
    } catch (err) {
      console.error("useResource Error:", err);
      setError(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, limit, filters, refreshToggle]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  // Actions
  const refresh = useCallback(() => setRefreshToggle(prev => !prev), []);
  
  const changePage = useCallback((newPage) => setPage(newPage), []);
  
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  return {
    data,
    loading,
    error,
    pagination: {
      page,
      limit,
      totalPages,
      totalItems,
      setPage: changePage,
      setLimit,
    },
    filters,
    setFilter: updateFilter,
    setFilters: updateFilters,
    setFilters: updateFilters,
    refresh,
    setError, // Expose setError to allow manual error handling in consuming hooks
  };
};
