import BaseService from "./baseService";
import apiClient from "../lib/apiClient";
import { getExtractableId } from "../lib/apiUtils";

class ContactService extends BaseService {
  constructor() {
    super('/contact-us');
  }

  // PATCH update read/unread status
  async updateReadStatus(idOrObj, isRead) {
      const id = getExtractableId(idOrObj);
      return await apiClient.patch(`${this.endpoint}/${id}/read-status`, { isRead });
  }

  // GET contact statistics (Admins only)
  async getStatistics(year = null, month = null) {
      const params = {};
      if (year != null) params.year = year;
      if (month != null) params.month = month;
      
      const queryString = this.buildQuery(params);
      return await apiClient.get(`${this.endpoint}/statistics${queryString}`);
  }
}

const contactService = new ContactService();

export const getContacts = (page, limit, isRead) => contactService.getAll({ page, limit, isRead });

export const updateContactReadStatus = (id, isRead) => contactService.updateReadStatus(id, isRead);

export const getContactStatistics = (year, month) => contactService.getStatistics(year, month);

export default contactService;
