import BaseRepository from "../../core/BaseRepository.js";
import { db } from "../../config/database.js";
import ApiError from "../../core/ApiError.js";

export default class AppointmentsRepository extends BaseRepository {
    constructor() {
        super(db, "appointments");
    }
}