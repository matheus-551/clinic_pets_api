export default class BaseService {
  constructor(repository) {
    if (!repository) throw new Error("Repository instance is required");
    this.repository = repository;
  }

  findAll() {
    return this.repository.findAll();
  }

  findById(id) {
    return this.repository.findById(id);
  }

  create(data) {
    return this.repository.create(data);
  }

  update(id, data) {
    return this.repository.update(id, data);
  }

  delete(id) {
    return this.repository.delete(id);
  }
}
