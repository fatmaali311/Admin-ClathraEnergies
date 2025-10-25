// ✅ Service Layer for Configuration API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

        const data = await response.json();
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