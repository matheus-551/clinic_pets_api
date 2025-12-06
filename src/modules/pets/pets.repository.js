import { db } from "../../config/database";
import BaseRepository from "../../core/BaseRepository";


export default class PetsRepository extends BaseRepository {
    constructor() {
        super(db, "pets");
    }
}