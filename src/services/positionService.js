// Resolve API base from multiple possible sources (Vite env or global injection)
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.API_BASE_UR || window.API_BASE_URL)) || "http://localhost:3000";

const getHeaders = (token, contentType = "application/json") => ({
  "Content-Type": contentType,
  "Accept": "application/json",
  "Authorization": `Bearer ${token}`,
});

// GET all positions
export const getPositions = async (token, page = 1, limit = 10) => {
  try {
    const url = `${API_BASE_URL}/positions?page=${page}&limit=${limit}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(token, "application/json"),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Failed to fetch positions:", response.status, errText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching positions:", error);
    return null;
  }
};

// POST create a new position
export const createPosition = async (token, positionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/positions`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(positionData),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Failed to create position:", response.status, errText);
      throw new Error(errText);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating position:", error);
    throw error;
  }
};

// PATCH update an existing position
export const updatePosition = async (token, id, positionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(positionData),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Failed to update position:", response.status, errText);
      throw new Error(errText);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating position:", error);
    throw error;
  }
};

// DELETE delete a position
export const deletePosition = async (token, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
      method: "DELETE",
      headers: getHeaders(token, "application/json"),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Failed to delete position:", response.status, errText);
      throw new Error(errText);
    }

    // DELETE usually returns 200 with no content or a simple message
    return response.status === 200 ? { message: "Position deleted successfully" } : null;
  } catch (error) {
    console.error("❌ Error deleting position:", error);
    throw error;
  }
};