import { useCallback, useEffect } from "react";
import contactService from "../services/contactService";
import { useResource } from "./useResource";

/**
 * Custom hook to fetch and manage paginated contact submissions.
 */
export const useContacts = (initialParams = {}) => {
  // Support both object params (new standard) and positional arguments (legacy compatibility not strictly needed internal usage, but good practice if used elsewhere)
  // Actually, let's stick to the new standard for resource hooks: object params.
  // Unless we want to keep backward compat which was (page, limit, readFilter).
  // Let's assume we update call sites to use object.
  const { page = 1, limit = 10, readFilter } = initialParams;

  const fetcher = useCallback((params) => contactService.getAll(params), []);

  // Map readFilter ('read'/'unread'/undefined) to boolean/undefined
  const getIsReadValue = (filter) => {
      if (filter === 'read') return true;
      if (filter === 'unread') return false;
      return undefined;
  };

  const isRead = getIsReadValue(readFilter);

  const resource = useResource(fetcher, { page, limit, isRead });
  const {
      data: contacts,
      loading,
      pagination: { totalPages, totalItems, setPage, setLimit },
      refresh,
      setFilters
  } = resource;

  // Sync prop changes to filters
  useEffect(() => {
      setFilters(prev => ({ ...prev, isRead: getIsReadValue(readFilter) }));
  }, [readFilter, setFilters]);

  // Handle case where useResource returns empty array/null gracefully

  return { 
    contacts: contacts || [], 
    loading, 
    totalPages, 
    totalContacts: totalItems, 
    refetchContacts: refresh,
    resource // Expose full resource
  };
};
