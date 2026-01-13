import BaseService from "./baseService";
import apiClient from "../lib/apiClient";
import { getExtractableId } from "../lib/apiUtils";

class ApplicationService extends BaseService {
  constructor() {
    super('/applications');
  }

  // Override getAll if we need specific param mappings, but base might suffice matches.
  // Original: page, limit, status, positionId
  // Base: params object.
  // We will call it as: getAll({ page, limit, status, positionId })

  // Custom method: PATCH status
  async updateStatus(idOrObj, newStatus) {
    const id = getExtractableId(idOrObj);
    return await apiClient.patch(`${this.endpoint}/${id}/status?status=${newStatus}`);
  }

  // Custom method: Stats
  async getStatistics(year = null, month = null) {
      const params = {};
      if (year != null) params.year = year;
      if (month != null) params.month = month;
      
      const queryString = this.buildQuery(params);
      return await apiClient.get(`${this.endpoint}/statistics${queryString}`);
  }
}

const applicationService = new ApplicationService();

// Export individual methods for backward compatibility if needed, 
// or export the instance as default. 
// The existing code uses named exports: getApplications, etc.
// I should export adapters to avoid breaking changes in pages immediately, 
// or I can update the imports. Updating imports is cleaner but more work.
// I'll export adapters for now to support incremental refactor, 
// but eventually, we want to use the instance.

export const getApplications = (page, limit, status, positionId) => {
    return applicationService.getAll({ page, limit, status, positionId });
};

export const getApplicationById = (id) => applicationService.getById(id);

export const updateApplicationStatus = (id, status) => applicationService.updateStatus(id, status);

export const deleteApplication = (id) => applicationService.delete(id);

export const getApplicationsStatistics = (year, month) => applicationService.getStatistics(year, month);

export default applicationService;
