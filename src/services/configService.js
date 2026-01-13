import apiClient from "../lib/apiClient";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const normalizeMedia = (obj = {}) => {
    const normalized = { ...obj };
    // Normalize images
    if (normalized.images) {
        Object.keys(normalized.images).forEach(k => {
            const v = normalized.images[k];
            if (v && typeof v === 'string' && !v.startsWith('http')) {
                // prepend API base
                normalized.images[k] = `${API_BASE_URL}${v.startsWith('/') ? '' : '/'}${v}`;
            }
        });
    }
    // Normalize videos
    if (normalized.videos) {
        Object.keys(normalized.videos).forEach(k => {
            const v = normalized.videos[k];
            if (v && typeof v === 'string' && !v.startsWith('http')) {
                normalized.videos[k] = `${API_BASE_URL}${v.startsWith('/') ? '' : '/'}${v}`;
            }
        });
    }
    return normalized;
}

export const getConfiguration = async () => {
    try {
        let data = await apiClient.get('/config');
        
        // Ensure returned media URLs are absolute so the admin UI can load them in production
        try {
            data = normalizeMedia(data);
        } catch (e) {
            // ignore normalization errors and return raw data
            // console.warn('Could not normalize media URLs', e);
        }
        if (import.meta.env.DEV) {
           console.log("✅ Configuration fetched:", data);
        }
        return data;
    } catch (error) {
        // console.error("❌ Error fetching configuration:", error);
        return null;
    }
};

export const updateConfigurationWithFiles = async (formData) => {
    try {
        // axios automatically sets Content-Type to multipart/form-data when body is FormData
        const data = await apiClient.post('/config/add-or-update', formData);

        // Success case
        if (import.meta.env.DEV) {
            console.log("✅ Configuration updated successfully:", data);
        }
        return {
            success: true,
            message: data.message || "Configuration updated successfully!",
            data: data,
        };
    } catch (error) {
        // console.error("❌ Error updating configuration:", error);
        // Extract validation errors if available
        const errors = error.response?.data?.errors || null;
        const message = error.response?.data?.message || error.message;
        return { success: false, message, errors };
    }
};
