import { useCallback } from "react";
import { getAdmins, removeAdmin, resendCompleteProfile } from "../Auth/services/userService";
import { useResource } from "./useResource";

/**
 * Hook to manage Admin Users (pagination, fetching, deletion)
 * uses useResource for standardized state management
 */
export const useUsers = (initialParams = {}) => {
  const { page = 1, limit = 10 } = initialParams;

  const fetcher = useCallback(async (params) => {
    // userService.getAdmins(page, itemsPerPage)
    // returns { ok: true, data: { data: [], meta: { page, limit, totalPages, totalAdmins } } }
    const response = await getAdmins(params.page, params.limit);
    
    if (response.ok) {
        const { data: rawUsers = [], meta } = response.data || {};
        
        // Map users to consistent format
        const mappedUsers = rawUsers.map((u) => ({
            id: u._id,
            email: u.email,
            fullName: u.fullName,
            userName: u.userName,
            role: u.role || "admin",
            isSetupComplete: u.isProfileCompleted,
        }));

        return {
            data: mappedUsers,
            totalPages: Number(meta?.totalPages) || 1,
            totalItems: Number(meta?.totalAdmins) || 0
        };
    } else {
        throw new Error(response.data?.message || "Failed to fetch admin users");
    }
  }, []);

  const resource = useResource(fetcher, { page, limit });
  const { refresh, setError } = resource;

  const removeUser = useCallback(async (id) => {
    const response = await removeAdmin(id);
    if (response.ok) {
        refresh();
        return { ok: true };
    } else {
        throw new Error(response.data?.message || "Failed to remove admin");
    }
  }, [refresh]);

  const resendInvite = useCallback(async (email) => {
      const response = await resendCompleteProfile(email);
      if (response.ok) {
          return { ok: true };
      } else {
          throw new Error(response.data?.message || "Failed to resend invitation");
      }
  }, []);

  return {
      resource,
      removeUser,
      resendInvite,
      refresh
  };
};
