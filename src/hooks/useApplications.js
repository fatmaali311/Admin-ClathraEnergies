import { useEffect, useState, useCallback } from "react";
import { getApplications } from "../services/applicationService";

/**
 * Custom hook to fetch and manage paginated and filtered job applications.
 * @param {string} token - Authentication token.
 * @param {number} page - Current page number.
 * @param {number} limit - Items per page.
 * @param {string} status - Filter status ('pending', 'approved', etc.)
 * @returns {{applications: object[], loading: boolean, totalPages: number, totalApplications: number, refetchApplications: () => void}}
 */
export const useApplications = (token, page = 1, limit = 10, status = '') => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Function to trigger a re-fetch of applications
  const refetchApplications = useCallback(() => setRefreshToggle(prev => !prev), []);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      const data = await getApplications(token, page, limit, status);

      if (data && data.data) {
        setApplications(data.data);
        setTotalPages(data.totalPages || 1);
        setTotal(data.totalItems || 0);
      } else {
        setApplications([]);
        setTotalPages(1);
        setTotal(0);
      }

      setLoading(false);
    };

    if (token) fetchApplications();
  }, [token, page, limit, status, refreshToggle]);

  return { applications, loading, totalPages, totalApplications: total, refetchApplications };
};