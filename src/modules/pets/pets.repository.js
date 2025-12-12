import { db } from "../../config/database.js";
import BaseRepository from "../../core/BaseRepository.js";


export default class PetsRepository extends BaseRepository {
    constructor() {
        super(db, "pets");
    }

    async findAll() {
        const result = await this.execute(
            `SELECT pet.id
              , pet.name
              , pet.breed
              , pet.species
              , pet.birthdate
              , owner.id AS owner_id
              , owner.name AS owner_name
           FROM ${this.table} AS pet
           INNER JOIN owners owner ON pet.owner_id = owner.id 
           ORDER BY pet.name ASC`
        )

        return result;
    }

    async existsByOwnerId(owner_id) {
        const result = await this.execute(`SELECT * FROM ${this.table} WHERE owner_id = ?`, [owner_id]);
        return !!result.length;
    }
}