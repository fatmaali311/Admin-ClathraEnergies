// Resolve API base from multiple possible sources (Vite env or global injection)
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.API_BASE_UR || window.API_BASE_URL)) || "http://localhost:3000";
const API_URL = `${API_BASE_URL}/services`;

const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const finalHeaders = { ...headers, ...options.headers };
  const response = await fetch(url, {
    ...options,
    headers: finalHeaders,
  });

  if (response.status === 204) return {};

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson ? data.message : response.statusText;
    throw { status: response.status, message: message || "Something went wrong" };
  }
  return data;
};

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
  fetchApi(`${API_URL}/add-or-update`, { method: "POST", body: formData });

export const getServices = (page = 1, limit = 10) =>
  fetchApi(`${API_URL}?page=${page}&limit=${limit}`);

export const getAllTitles = () => fetchApi(`${API_URL}/all-titles`);

export const getServiceByTitle = (title) => fetchApi(`${API_URL}/${title}`);

export const deleteService = (title) =>
  fetchApi(`${API_URL}/${title}`, { method: "DELETE" });