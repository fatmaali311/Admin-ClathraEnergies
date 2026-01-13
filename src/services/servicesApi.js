import apiClient from "../lib/apiClient";
const API_URL = `/services`;

// Helper to convert object + files to FormData (kept for UI compatibility)
export const toServiceFormData = (serviceObj, files = {}) => {
  const formData = new FormData();
  
  formData.append("data", JSON.stringify(serviceObj));
  
  Object.entries(files).forEach(([key, file]) => {
    if (file instanceof File) {
      formData.append(key, file, file.name);
    }
  });
  return formData;
};

export const addOrUpdateService = (formData) =>
  apiClient.post(`${API_URL}/add-or-update`, formData);

export const getServices = (page = 1, limit = 10) =>
  apiClient.get(`${API_URL}?page=${page}&limit=${limit}`);

export const getAllTitles = () => apiClient.get(`${API_URL}/all-titles`);

export const getServiceByTitle = (title) => apiClient.get(`${API_URL}/${title}`);

export const deleteService = (title) =>
  apiClient.delete(`${API_URL}/${title}`);
