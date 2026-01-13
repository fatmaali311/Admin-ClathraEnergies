import apiClient from "../lib/apiClient";

/**
 * Fetches all available page titles and IDs for dynamic navigation.
 * @returns {Promise<Array<{_id: string, title: string}>>} List of pages or an empty array on failure.
 */
export const getAllPageTitles = async () => {
    try {
        const data = await apiClient.get('/pages/all-titles');
        return data; 
    } catch (error) {
        // Return empty array to avoid breaking UI that expects array
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
        const data = await apiClient.get(`/pages/${title}`);
        if (import.meta.env.DEV) {
             console.log(`Page content for '${title}' fetched:`, data);
        }
        return data; // Contains { pageObj, images }
    } catch (error) {
        return null;
    }
};

/**
 * Creates or updates page content with files.
 * @param {FormData} formData - FormData containing 'data' (JSON string) and file fields.
 * @returns {Promise<boolean>} True if update was successful, false otherwise.
 */
export const updatePageContentWithFiles = async (formData) => {
  try {
    const data = await apiClient.post('/pages/add-or-update', formData);
    
    if (import.meta.env.DEV) {
        console.log("Page content updated successfully:", data);
    }
    return true;
  } catch (error) {
    if (error.response?.status === 401) {
       // Handled by global interceptor but we might return false here for local logic
       return false;
    }
    return false;
  }
};
