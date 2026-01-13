import BaseService from "./baseService";

class PositionService extends BaseService {
  constructor() {
    super('/positions');
  }
}

const positionService = new PositionService();

// Exports for backward compatibility
export const getPositions = (page, limit) => positionService.getAll({ page, limit });
export const getPositionById = (id) => positionService.getById(id);
export const createPosition = (data) => positionService.create(data);
export const updatePosition = (id, data) => positionService.update(id, data);
export const deletePosition = (id) => positionService.delete(id);

export default positionService;
