import {nanoid} from "nanoid";

import {ActionName, ActionType} from "../../types/ActionsType";
import {DBFlagType} from "../../types/DBFlagType";
import {StoreName} from "../../types/StoreName";


/**
 * представление совершенного действия
 *
 * Содержит информацию о:
 * -  времени, когда было совершено действие (__datetime__)
 * -  имени сущности, которую изменили (__entity__)
 * -  кем совершено изменение (__user_id__)
 *
 * synced - флаг, сигнализирует о том, что action доставлен
 *
 * содержит поля:
 *
 * __id__,
 * __action__,
 * __data__,
 * __datetime__,
 * __entity__,
 * __synced__,
 * __user_id__,
 */
export class Action<T extends object> {

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

