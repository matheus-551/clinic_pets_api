import BaseRepository from "../../core/BaseRepository.js";
import { db } from "../../config/database.js";
import ApiError from "../../core/ApiError.js";

export default class AppointmentsRepository extends BaseRepository {
    constructor() {
        super(db, "appointments");
    }

    async findAll() {
        const result = await this.execute(
            `SELECT appt.id
                  , appt.date
                  , appt.description
                  , appt.veterinarian_name
                  , appt.status
                  , pet.id AS pet_id
                  , pet.name AS pet_name
                  , owner.name AS owner_name
               FROM ${this.table} AS appt
               INNER JOIN pets pet ON appt.pet_id = pet.id 
               INNER JOIN owners owner ON pet.owner_id = owner.id 
               ORDER BY appt.id DESC
            `
        );

        return result;
    }

    async existsByPetId(pet_id) {
        const result = await this.execute(`SELECT * FROM ${this.table} WHERE pet_id=?`, [pet_id]);
        return !!result.length;
    }
}