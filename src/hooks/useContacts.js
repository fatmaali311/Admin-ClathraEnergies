import { useEffect, useState } from "react";
import { getContacts } from "../services/contactService";

/**
 * Custom hook to fetch and manage paginated contact submissions.
 * * @param {string} token - Authentication token.
 * @param {number} page - Current page number.
 * @param {number} limit - Items per page.
 * @param {boolean | undefined} readFilter - Filter by read status: true (read), false (unread), undefined (all).
 * @returns {{contacts: object[], loading: boolean, totalPages: number, totalContacts: number, refetchContacts: () => void}}
 */
export const useContacts = (token, page = 1, limit = 10, readFilter) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshToggle, setRefreshToggle] = useState(false); // New state to force a re-fetch

  const refetchContacts = () => setRefreshToggle(prev => !prev); // Function to trigger re-fetch

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
    
      let isReadApiValue;
      if (readFilter === 'read') {
        isReadApiValue = true;
      } else if (readFilter === 'unread') {
        isReadApiValue = false;
      } else {
        isReadApiValue = undefined; // Sends no isRead param to get all contacts
      }

      const data = await getContacts(token, page, limit, isReadApiValue);

      if (data && data.data) {
        setContacts(data.data);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      } else {
        setContacts([]);
        setTotalPages(1);
        setTotal(0);
      }

      setLoading(false);
    };

    if (token) fetchContacts();
    // Added readFilter and refreshToggle to the dependency array
  }, [token, page, limit, readFilter, refreshToggle]); 

  // Renamed 'total' to 'totalContacts' for clarity in the ContactUsPage
  return { contacts, loading, totalPages, totalContacts: total, refetchContacts }; 
};