// src/services/pageService.js
// Resolve API base from multiple possible sources (Vite env or global injection)
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.API_BASE_UR || window.API_BASE_URL)) || "http://localhost:3000";

/**
 * Fetches all available page titles and IDs for dynamic navigation.
 * @returns {Promise<Array<{_id: string, title: string}>>} List of pages or an empty array on failure.
 */
export const getAllPageTitles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pages/all-titles`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      console.error("Failed to fetch all page titles:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data; // e.g., [{ _id: "...", title: "home" }, ...]
  } catch (error) {
    console.error("Error fetching all page titles:", error);
    return [];
  }
};

/**
 * Fetches the content for a specific page by its title.
 * @param {string} title - The title of the page (e.g., 'home', 'about-us').
 * @returns {Promise<object | null>} The page data object (pageObj and images) or null on failure.
 */
export const getPageContentByTitle = async (title) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pages/${title}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch page '${title}':`, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log(`Page content for '${title}' fetched:`, data);
    return data; // Contains { pageObj, images }
  } catch (error) {
    console.error(`Error fetching page '${title}':`, error);
    return null;
  }
};

/**
 * Creates or updates page content with files.
 * @param {string} token - User's authentication token.
 * @param {FormData} formData - FormData containing 'data' (JSON string) and file fields.
 * @returns {Promise<boolean>} True if update was successful, false otherwise.
 */
export const updatePageContentWithFiles = async (token, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pages/add-or-update`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      // Note: Do not set 'Content-Type': 'multipart/form-data'. 
      // The browser handles this automatically when passing a FormData object.
      body: formData,
    });

  if (response.status === 401) {
    console.error("Unauthorized: Token wrong or you are not an admin.");
    return false;
  }

    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to update page content:", errText);
      return false;
    }

    const data = await response.json();
    console.log("Page content updated successfully:", data);
    return true;
  } catch (error) {
    console.error("Error updating page content:", error);
    return false;
  }
};