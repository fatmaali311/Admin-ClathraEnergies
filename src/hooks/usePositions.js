import { useEffect, useState } from "react";
import { getPositions } from "../services/positionService";

/**
 * Custom hook to fetch and manage paginated job positions.
 * @param {string} token - Authentication token.
 * @param {number} page - Current page number.
 * @param {number} limit - Items per page.
 * @returns {{positions: object[], loading: boolean, totalPages: number, totalPositions: number, refetchPositions: () => void}}
 */
export const usePositions = (token, page = 1, limit = 10) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Function to trigger a re-fetch of positions
  const refetchPositions = () => setRefreshToggle(prev => !prev);

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      const data = await getPositions(token, page, limit);

      if (data && data.data) {
        setPositions(data.data);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      } else {
        setPositions([]);
        setTotalPages(1);
        setTotal(0);
      }

      setLoading(false);
    };

    if (token) fetchPositions();
  }, [token, page, limit, refreshToggle]);

  return { positions, loading, totalPages, totalPositions: total, refetchPositions };
};