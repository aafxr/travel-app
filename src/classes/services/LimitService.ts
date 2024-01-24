import {Action, Limit, User} from "../StoreEntities";
import {StoreName} from "../../types/StoreName";
import {ActionName} from "../../types/ActionsType";
import {DB} from "../../db/DB";
import {LimitType} from "../../types/LimitType";

export class LimitService {

    static async create(limit: Partial<LimitType> & Pick<LimitType, 'section_id'>, user: User) {
        const newLimit = new Limit(limit, user.id)
        const action = new Action(newLimit, user.id, StoreName.LIMIT, ActionName.ADD)
        const tx = await DB.transaction([StoreName.LIMIT, StoreName.ACTION])
        const limitStore = tx.objectStore(StoreName.LIMIT)
        const actionStore = tx.objectStore(StoreName.ACTION)
        limitStore.add(newLimit.dto())
        actionStore.add(action.dto())
        return newLimit

    }

    static async update(limit: Limit, user: User) {
        const action = new Action(limit, user.id, StoreName.LIMIT, ActionName.UPDATE)
        const tx = await DB.transaction([StoreName.LIMIT, StoreName.ACTION])
        const limitStore = tx.objectStore(StoreName.LIMIT)
        const actionStore = tx.objectStore(StoreName.ACTION)
        limitStore.put(limit.dto())
        actionStore.add(action.dto())
        return user
    }

    static async delete(limit: Limit, user: User) {
        const action = new Action(user, user.id, StoreName.LIMIT, ActionName.DELETE)
        const tx = await DB.transaction([StoreName.ACTION, StoreName.LIMIT])
        const userStore = tx.objectStore(StoreName.LIMIT)
        const actionStore = tx.objectStore(StoreName.ACTION)
        userStore.delete(limit.id)
        actionStore.add(action.dto())
    }
}