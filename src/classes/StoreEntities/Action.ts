import {nanoid} from "nanoid";

import {ActionName, ActionType} from "../../types/ActionsType";
import {DBFlagType} from "../../types/DBFlagType";
import {StoreName} from "../../types/StoreName";
import {StorageEntity} from "./StorageEntity";

export class Action<T extends StorageEntity> extends StorageEntity implements ActionType {

    id = nanoid(16);
    action: ActionName;
    data: T;
    datetime = new Date();
    entity: StoreName;
    synced: DBFlagType = 0;
    user_id = '';

    constructor(data: T, user_id: string, entity: StoreName, action: ActionName) {
        super()

        this.data = data
        this.user_id = user_id
        this.entity = entity
        this.action = action
    }

    dto(): ActionType{
        return {
            id: this.id,
            action: this.action,
            data: this.data.dto(),
            datetime: this.datetime,
            entity: this.entity,
            synced: this.synced,
            user_id: this.user_id,
        }
    }
}

