const API_BASE_URL = import.meta.env.VITE_API_URL
    || import.meta.env.VITE_API_BASE_URL
    || (typeof window !== 'undefined' && (window.API_BASE_UR || window.API_BASE_URL))
    || "http://localhost:3000";

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
        const response = await fetch(`${API_BASE_URL}/config`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            // Replaced logger call with console.error
            console.error("❌ Failed to fetch configuration:", response.statusText);
            return null;
        }

        let data = await response.json();
        // Ensure returned media URLs are absolute so the admin UI can load them in production
        try {
            data = normalizeMedia(data);
        } catch (e) {
            // ignore normalization errors and return raw data
            console.warn('Could not normalize media URLs', e);
        }
        // Replaced logger call with console.log
        console.log("✅ Configuration fetched:", data);
    return data;
    } catch (error) {
        console.error("❌ Error fetching configuration:", error);
        return null;
    }
};

export const updateConfigurationWithFiles = async (token, formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/config/add-or-update`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        // ✅ IMPORTANT: Read the response body regardless of success/fail status
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            // If response is not JSON (e.g., plain text 500 error), treat it as a message
            data = { message: text || response.statusText };
        }

        if (!response.ok) {
            // Log the full error response from backend
            console.error("❌ Failed to update configuration:", data); 

            return {
                success: false,
                message: data.message || "Failed to update configuration.",
                errors: data.errors || null, // Capture validation errors from the backend
            };
        }

        // Success case
        console.log("✅ Configuration updated successfully:", data);
        return {
            success: true,
            message: data.message || "Configuration updated successfully!",
            data: data,
        };
    } catch (error) {
        // Catch network or JSON parse errors
        console.error("❌ Error updating configuration:", error);
        return { success: false, message: error.message };
    }
};