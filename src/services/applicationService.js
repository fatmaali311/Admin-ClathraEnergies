const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getHeaders = (token, contentType = "application/json") => {
  const headers = {
    "Accept": "application/json",
    "Authorization": `Bearer ${token}`,
  };
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  return headers;
};

// GET all applications (Admins only)
export const getApplications = async (token, page = 1, limit = 10, status = '') => {
  try {
    let url = `${API_BASE_URL}/applications?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(token, "application/json"),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Failed to fetch applications:", response.status, errText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    return null;
  }
};

// GET single application (Admins only)
export const getApplicationById = async (token, id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
            method: "GET",
            headers: getHeaders(token),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("❌ Failed to fetch application:", response.status, errText);
            throw new Error(errText);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error fetching application:", error);
        throw error;
    }
};

// PATCH update application status (Admins only)
export const updateApplicationStatus = async (token, id, newStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/status?status=${newStatus}`, {
      method: "PATCH",
      headers: getHeaders(token, "application/json"),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update status.' }));
      console.error("❌ Failed to update application status:", response.status, errorData);
      throw new Error(errorData.message || 'Failed to update status.');
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating application status:", error);
    throw error;
  }
};

// DELETE an application (Admins only)
export const deleteApplication = async (token, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: "DELETE",
      headers: getHeaders(token, "application/json"),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Failed to delete application:", response.status, errText);
      throw new Error(errText);
    }
    
    // Check if the response has content
    const result = response.status !== 204 ? await response.json() : { message: "Application deleted successfully" };
    return result;
  } catch (error) {
    console.error("❌ Error deleting application:", error);
    throw error;
  }
};

