import BaseService from "./BaseService";

export default class ExpenseService extends BaseService{
    /**@type{Travel}*/
    _travel
    constructor(travel, storeName) {
        super(storeName);
        this._travel = travel
    }

    async create(item, user_id) {
        const result = await super.create(item, user_id);
    }
}