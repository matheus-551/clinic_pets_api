import BaseService from "../../core/BaseService.js";
import ApiError from "../../core/ApiError.js";
import PetsRepository from "./pets.repository.js";
import OwnersService from "../owners/owners.service.js";
import AppointmentsRepository from "../appointments/appointments.repository.js";

const repository = new PetsRepository();
const ownersService = new OwnersService();
const appointmentsRepository = new AppointmentsRepository();

/**
 * @typedef {Object} PetDTO
 * @property {string} name - Nome do pet (obrigatório)
 * @property {string} species - Espécie do pet (obrigatório)
 * @property {string} [breed] - Raça do animal (opcional)
 * @property {number} ownerId - ID do dono do animal (obrigatório)
 */

export default class PetsService extends BaseService {
    constructor() {
        super(repository);
    }

    /**
     * 
     * @param {{
     *  name: string required,
     *  species: string required,
     *  breed: string,
     *  birthdate: datetime,
     *  owner_id    : number required,
     * }} data 
     */
    validate(data) {
        if (!data.name) throw new ApiError(400, "O nome é obrigatorio");
        if (data.name.trim().length <= 0) throw new ApiError(400, "O nome é obrigatorio");
        if (!data.species) throw new ApiError(400, "A especie é obrigatorio");
        if (data.species.trim().length <= 0) throw new ApiError(400, "A especie é obrigatorio");
        if (!data.owner_id) throw new ApiError(400, "O dono do pet é obrigatorio");
    }

    /**
     * 
     * @param {{
     *  name: string required,
     *  species: string required,
     *  breed: string,
     *  birthdate: datetime,
     *  owner_id: number required
     * }} data 
    */
    async create(data) {
        this.validate(data);

        const owner = await ownersService.findById(data.owner_id);

        if (!owner) {
            throw new ApiError(404, "Dono do pet não encontrado.");
        }

        data.owner_id = owner.id;

        data.birthdate = new Date(data.birthdate);

        return super.create(data);
    }

    async delete(id) {
        const pet = await repository.findById(id);

        const existAppointments = await appointmentsRepository.existsByPetId(pet.id);

        if (existAppointments) 
            throw new ApiError(400, "O pet possui agendamentos vinculados e não pode ser excluído.");

        return super.delete(id);
    }
}