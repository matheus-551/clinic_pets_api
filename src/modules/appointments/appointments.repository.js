import BaseRepository from "../../core/BaseRepository.js";
import { db } from "../../config/database.js";
import ApiError from "../../core/ApiError.js";

export default class AppointmentsRepository extends BaseRepository {
    constructor() {
        super(db, "appointments");
    }

    async existsByPetId(pet_id) {
        const result = await this.execute(`SELECT * FROM ${this.table} WHERE pet_id=?`, [pet_id]);
        return !!result.length;
    }
}