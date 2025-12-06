import BaseService from "../../core/BaseService";
import PetsRepository from "./pets.repository";
import OwnersService from "../owners/owners.service";

const repository = new PetsRepository();
const ownersService = new OwnersService();

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
     *  ownerId: number required
     * }} data 
     */
    validate(data) {
        if (!data.name) throw new ApiError(400, "O nome é obrigatorio");
        if (data.name.trim().length <= 0) throw new ApiError(400, "O nome é obrigatorio");
        if (!data.species) throw new ApiError(400, "A especie é obrigatorio");
        if (data.species.trim().length <= 0) throw new ApiError(400, "A especie é obrigatorio");
        if (!data.ownerId) throw new ApiError(400, "O dono do pet é obrigatorio");
    }

    /**
     * 
     * @param {{
     *  name: string required,
     *  species: string required,
     *  breed: string,
     *  ownerId: number required
     * }} data 
    */
    async create(data) {
        this.validate(data);

        const owner = await ownersService.findById(data.ownerId);

        if (!owner) {
            throw new ApiError(404, "Dono do pet nao encontrado.");
        }

        data.ownerId = owner.id;
        return super.create(data);
    }
}