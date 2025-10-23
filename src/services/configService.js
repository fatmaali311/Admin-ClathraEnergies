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
        import('../utils/logger').then(({ default: logger }) => logger.error("❌ Failed to fetch configuration:", response.statusText));
      return null;
    }

    const data = await response.json();
      import('../utils/logger').then(({ default: logger }) => logger.log("✅ Configuration fetched:", data));
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

    if (!response.ok) {
      const errText = await response.text();
        import('../utils/logger').then(({ default: logger }) => logger.error("❌ Failed to update configuration:", errText));
      return false;
    }

    const data = await response.json();
      import('../utils/logger').then(({ default: logger }) => logger.log("✅ Configuration updated successfully:", data));
    return true;
  } catch (error) {
      import('../utils/logger').then(({ default: logger }) => logger.error("❌ Error updating configuration:", error));
    return false;
  }
};
