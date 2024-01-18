import {ActionName, ActionType} from "../types/ActionsType";
import {StoreName} from "../types/StoreName";
import {DBFlagType} from "../types/DBFlagType";
import {nanoid} from "nanoid";

export class Action<T> implements ActionType<T> {
    id = nanoid(16);
    action: ActionName;
    data: T;
    datetime = new Date();
    entity: StoreName;
    synced: DBFlagType = 0;
    user_id = '';

    constructor(data: T, user_id: string, entity: StoreName, action: ActionName) {
        this.data = data
        this.user_id = user_id
        this.entity = entity
        this.action = action
    }
}