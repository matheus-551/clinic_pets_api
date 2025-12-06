import { db } from "../../config/database.js";
import BaseRepository from "../../core/BaseRepository.js";


export default class PetsRepository extends BaseRepository {
    constructor() {
        super(db, "pets");
    }

    async existsByOwnerId(owner_id) {
        const result = await this.execute(`SELECT * FROM ${this.table} WHERE owner_id = ?`, [owner_id]);
        return !!result.length;
    }
}