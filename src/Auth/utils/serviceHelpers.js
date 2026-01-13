/**
 * Helper to maintain compatibility with existing components that expect { ok, status, data }
 */
export const handleRequest = async (requestPromise) => {
  try {
    const data = await requestPromise;
    return { ok: true, status: 200, data };
  } catch (error) {
    console.error("API Error:", error);
    return { 
      ok: false, 
      status: error.response?.status || 500, 
      data: error.response?.data || null,
      error: error.response?.data || error.message
    };
  }
};
