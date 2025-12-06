import ApiError from "../../core/ApiError.js";
import BaseService from "../../core/BaseService.js";
import OwnersRepository from "./owners.repository.js";

const repository = new OwnersRepository();

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
        if (!data.name) throw new ApiError(400, "O nome é obrigatorio");
        if (data.name.trim().length <= 0) throw new ApiError(400, "O nome é obrigatorio");
        if (!data.phone) throw new ApiError(400, "O telefone é obrigatorio");
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
}