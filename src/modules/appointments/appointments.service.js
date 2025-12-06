import BaseService from "../../core/BaseService.js";

import AppointmentsRepository from "./appointments.repository.js";
import PetsService from "../pets/pets.service.js";

import ApiError from "../../core/ApiError.js";

const repository = new AppointmentsRepository();
const petsService = new PetsService();

export default class AppointmentsService extends BaseService {
    constructor() {
        super(repository);
    }

    /**
     * 
     * @param {{
     *   pet_id: Number required,
     *   date: DateTime required,
     *   veterinarian_name: string required,
     *   description: string,
     * }} data 
     */
    validate(data) {
        if (!data.pet_id) throw new ApiError(400, "O pet é obrigatorio");
        if (data.date) {
            try {
                data.date = new Date(data.date);

                if (data.date < new Date()) throw new ApiError(400, "A data nao pode ser menor que a data atual.");
            } catch (e) {
                throw new ApiError(400, "A data eh invalida");
            }
        } else {
            throw new ApiError(400, "A data eh obrigatoria");
        }
        if (!data.veterinarian_name || data.veterinarian_name.trim().length <= 0) throw new ApiError(400, "O veterinario eh obrigatorio");
    }

    /**
     * 
     * @param {{
     *   pet_id: Number required,
     *   date: DateTime required,
     *   veterinarian_name: string required,
     *   description: string,
     * }} data 
     * @returns 
     */
    async create(data) {
        this.validate(data);

        const pet = await petsService.findById(data.pet_id);
        
        data.pet_id = pet.id;
        return super.create(data);
    }

    async update(id, data) {
        if(data.date) {
            try {
                data.date = new Date(data.date);                
            } catch (e) {
                throw new ApiError(400, "A data eh invalida");
            }
        }

        return super.update(id, data);
    }
}