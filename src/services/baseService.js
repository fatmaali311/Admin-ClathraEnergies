import apiClient from "../lib/apiClient";
import { getExtractableId } from "../lib/apiUtils";

/**
 * Base Service class for standard CRUD operations.
 * Extend this class to create specific services.
 */
class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  /**
   * Helper to build query string from object
   * @param {object} params 
   */
  buildQuery(params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, value);
        }
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * GET all resources with optional pagination and filters
   * @param {object} params - { page, limit, ...filters }
   */
  async getAll(params = {}) {
    const queryString = this.buildQuery(params);
    return await apiClient.get(`${this.endpoint}${queryString}`);
  }

  /**
   * GET single resource by ID
   * @param {string} id 
   */
  async getById(id) {
    return await apiClient.get(`${this.endpoint}/${id}`);
  }

  /**
   * POST create new resource
   * @param {object|FormData} data 
   */
  async create(data) {
    return await apiClient.post(this.endpoint, data);
  }

  /**
   * PATCH update resource
   * @param {string|object} idOrObj 
   * @param {object|FormData} data 
   */
  async update(idOrObj, data) {
    const id = getExtractableId(idOrObj);
    return await apiClient.patch(`${this.endpoint}/${id}`, data);
  }

  /**
   * DELETE resource
   * @param {string|object} idOrObj 
   */
  async delete(idOrObj) {
    const id = getExtractableId(idOrObj);
    return await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export default BaseService;
