import ApiError from "../../core/ApiError.js";
import BaseService from "../../core/BaseService.js";
import OwnersRepository from "./owners.repository.js";
import PetsRepository from "../pets/pets.repository.js";

const repository = new OwnersRepository();
const petsRepository = new PetsRepository();

export default class OwnersService extends BaseService {
    constructor() {
        super(repository);
    }

    /**
     * 
     * @param {{
     *     name: string,
     *     phone: string,
     *     address: string
     * }} data 
     */
    validade(data) {
        if (!data.name) throw new ApiError(400, "O nome é obrigatório.");
        if (data.name.trim().length <= 0) throw new ApiError(400, "O nome é obrigatório.");
        if (!data.phone) throw new ApiError(400, "O telefone é obrigatório.");
    }

        /**
     * 
     * @param {{
     *     name: string,
     *     phone: string,
     *     address: string
     * }} data 
     */
    create(data) {
        this.validade(data);
        return super.create(data);
    }

    async delete(id) {
        const owner = await repository.findById(id);

        const existPets = await petsRepository.existsByOwnerId(owner.id);

        if (existPets) 
            throw new ApiError(400, "O dono possui pets vinculados e não pode ser excluído.");

        return super.delete(id);
    }
}