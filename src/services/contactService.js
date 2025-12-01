const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.API_BASE_UR || window.API_BASE_URL)) || "http://localhost:3000";

// GET all contacts
export const getContacts = async (token, page = 1, limit = 10, isRead) => {
  try {
    let url = `${API_BASE_URL}/contact-us?page=${page}&limit=${limit}`;
    if (typeof isRead !== "undefined") {
      url += `&isRead=${isRead}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Failed to fetch contacts:", response.status, errText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    return null;
  }
};

// PATCH update read/unread status
export const updateContactReadStatus = async (token, id, isRead) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact-us/${id}/read-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isRead }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Failed to update read status:", response.status, errText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating contact status:", error);
    return null;
  }
};

// GET contact statistics (Admins only)
export const getContactStatistics = async (token, year = null, month = null) => {
  try {
    let url = `${API_BASE_URL}/contact-us/statistics`;
    const params = [];
    if (year != null) params.push(`year=${year}`);
    if (month != null) params.push(`month=${month}`);
    if (params.length) url += `?${params.join('&')}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('❌ Failed to fetch contact statistics:', response.status, errText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching contact statistics:', error);
    return null;
  }
};
