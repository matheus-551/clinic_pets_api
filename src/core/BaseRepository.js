import logger from "../config/logger.js";
import ApiError from "./ApiError.js";
import { mapDbError } from "./dbErrorMapper.js";

export default class BaseRepository {
  constructor(db, table) {
    if (!table) throw new Error("Table name required for repository");
    this.db = db;
    this.table = table;
  }

  /**
   * Método central de execução com logs e tratamento de erro
   */
  async execute(sql, params = []) {
    const start = Date.now();
    try {
      const [result] = await this.db.query(sql, params);

      logger.info(`[DB] ${sql}`);

      return result;
    } catch (e) {
      logger.error(`[DB ERROR] ${sql}  | ${e.code} | ${e.message}`);
      logger.error(e);
      throw e instanceof ApiError ? e : mapDbError(e);
    }
  }


  // ---------------------------
  // Métodos CRUD
  // ---------------------------

  async findAll() {
    return await this.execute(`SELECT * FROM ${this.table}`);
  }

  async findById(id) {
    const result = await this.execute(`SELECT * FROM ${this.table} WHERE id=?`, [id]);
    if (!result.length) throw new ApiError(404, "Registro não encontrado");
    return result[0];
  }

  async create(data) {
    const result = await this.execute(`INSERT INTO ${this.table} SET ?`, data);
    return { id: result.insertId, ...data };
  }

  async update(id, data) {
    await this.findById(id);
    await this.execute(`UPDATE ${this.table} SET ? WHERE id=?`, [data, id]);
    return { id, ...data };
  }

  async delete(id) {
    await this.findById(id);
    await this.execute(`DELETE FROM ${this.table} WHERE id=?`, [id]);
    return { message: "Registro removido com sucesso" };
  }
}