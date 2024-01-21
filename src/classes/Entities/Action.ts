import {staticIDBMethods} from "../../decorators/class-decorators/staticIDBMethods";
import {ActionName, ActionType} from "../../types/ActionsType";
import {DBFlagType} from "../../types/DBFlagType";
import {StoreName} from "../../types/StoreName";
import {nanoid} from "nanoid";
import {WithDTOMethod} from "../../types/WithDTOMethod";
import {WithStoreProps} from "../../types/WithStoreProps";

export default class Action<T> implements ActionType<T>, WithDTOMethod, WithStoreProps {
    storeName = StoreName.ACTION
    withAction = false

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

    dto(): ActionType<T>{
        return {
            id: this.id,
            action: this.action,
            data: this.data,
            datetime: this.datetime,
            entity: this.entity,
            synced: this.synced,
            user_id: this.user_id,
        }
    }
}

