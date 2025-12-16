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

  async findAll({ skip, take, orderBy, filters } = {}, baseSql = null) {
    let sql = baseSql || `SELECT * FROM ${this.table}`;
    const params = [];
    let whereClause = "";

    if (filters && Object.keys(filters).length) {
      const wheres = Object.keys(filters).map(key => {
        params.push(filters[key]);
        return `${key} = ?`;
      });
      whereClause = ` WHERE ${wheres.join(" AND ")}`;
      sql += whereClause;
    }

    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }

    if (typeof skip === "number" && typeof take === "number") {
      sql += ` LIMIT ? OFFSET ?`;
      params.push(take, skip);
    }

    const data = await this.execute(sql, params);

    // count separado (com os mesmos filtros, sem paginação)
    let countSql = `SELECT COUNT(*) as total FROM ${this.table}`;
    if (whereClause) {
      countSql += whereClause;
    }
    const countResult = await this.execute(
      countSql,
      params.slice(0, params.length - (skip !== undefined && take !== undefined ? 2 : 0))
    );
    const total = countResult[0].total;

    return { data, total };
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