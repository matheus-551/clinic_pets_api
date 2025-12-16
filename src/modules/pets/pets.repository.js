import { db } from "../../config/database.js";
import BaseRepository from "../../core/BaseRepository.js";


export default class PetsRepository extends BaseRepository {
    constructor() {
        super(db, "pets");
    }

    async findAll(pagination = {}) {
        let sql = `SELECT pet.id
              , pet.name
              , pet.breed
              , pet.species
              , pet.birthdate
              , owner.id AS owner_id
              , owner.name AS owner_name
           FROM ${this.table} AS pet
           INNER JOIN owners owner ON pet.owner_id = owner.id 
        `;

        return super.findAll({
                skip: pagination.skip || 0,
                take: pagination.take || 10,
                orderBy: pagination.orderBy || "pet.name ASC",
                filters: pagination.filters
            }, sql
        );
    }

    async existsByOwnerId(owner_id) {
        const result = await this.execute(`SELECT * FROM ${this.table} WHERE owner_id = ?`, [owner_id]);
        return !!result.length;
    }
}