import { db } from "../../config/database.js";
import BaseRepository from "../../core/BaseRepository.js";


export default class PetsRepository extends BaseRepository {
    constructor() {
        super(db, "pets");
    }
}