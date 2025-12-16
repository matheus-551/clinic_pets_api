import OwnersService from "./owners.service.js";
const service = new OwnersService();

export default class OwnerController {
  static async getAll(req, res, next) { 
    try { 
      const { skip, take, orderBy, ...filters } = req.query;

      const result = await service.findAll({
        skip: skip?.trim() !== undefined ? parseInt(skip, 10) : undefined,
        take: take?.trim() !== undefined ? parseInt(take, 10) : undefined,
        orderBy,
        filters
      });
      res.json(result); 
    } 
    catch (e) { 
      next(e); 
    } 
  }

  static async getById(req, res, next) { 
    try { 
      res.json(await service.findById(req.params.id)); 
    } 
    catch (e) { 
      next(e); 
    } 
  }

  static async create(req, res, next) { 
    try { 
      res.status(201).json(await service.create(req.body)); 
    } 
    catch (e) { 
      next(e); 
    } 
  }

  static async update(req, res, next) { 
    try { 
      res.json(await service.update(req.params.id, req.body)); 
    } 
    catch (e) { 
      next(e); 
    } 
  }
  
  static async remove(req, res, next) { 
    try { 
      res.status(204).json(await service.delete(req.params.id)); 
    } 
    catch (e) { 
      next(e); 
    } 
  }
  
}
