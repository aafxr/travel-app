import {Action, Limit, User} from "../StoreEntities";
import {StoreName} from "../../types/StoreName";
import {ActionName} from "../../types/ActionsType";
import {DB} from "../db/DB";
import {LimitType} from "../../types/LimitType";
import {TravelService} from "./TravelService";
import {TravelError} from "../errors";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {IndexName} from "../../types/IndexName";
import {UserError} from "../errors/UserError";
import {Context} from "../Context/Context";

export class LimitService {

    static async create(context: Context, limit: Partial<LimitType> & Pick<LimitType, 'section_id' | 'primary_entity_id'>) {
        const user = context.user
        if(!user) throw UserError.unauthorized()

        const newLimit = new Limit(limit, user)
        const action = new Action(newLimit, user.id, StoreName.LIMIT, ActionName.ADD)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.LIMIT, StoreName.ACTION], 'readwrite')
        const limitStore = tx.objectStore(StoreName.LIMIT)
        const actionStore = tx.objectStore(StoreName.ACTION)
        limitStore.add(newLimit.dto())
        actionStore.add(action.dto())
        return newLimit

    }

    static async update(context: Context, limit: Limit) {
        const user = context.user
        if(!user) throw UserError.unauthorized()

        if(!limit.isPersonal(user)){
            const travel = await TravelService.getById(limit.primary_entity_id)
            if(!travel) throw TravelError.unexpectedTravelId(limit.primary_entity_id)
            if(!travel.permitChange(user)) throw TravelError.permissionDeniedToChangeTravel()
        }
        const action = new Action(limit, user.id, StoreName.LIMIT, ActionName.UPDATE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.LIMIT, StoreName.ACTION], 'readwrite')
        const limitStore = tx.objectStore(StoreName.LIMIT)
        const actionStore = tx.objectStore(StoreName.ACTION)
        limitStore.put(limit.dto())
        actionStore.add(action.dto())
        return user
    }

    static async delete(limit: Limit, user: User) {
        if(!limit.isPersonal(user)){
            const travel = await TravelService.getById(limit.primary_entity_id)
            if(!travel) throw TravelError.unexpectedTravelId(limit.primary_entity_id)
            if(!travel.permitDelete(user)) throw TravelError.permissionDeniedDeleteTravel()
        }
        const action = new Action(user, user.id, StoreName.LIMIT, ActionName.DELETE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.LIMIT, StoreName.ACTION], 'readwrite')
        const userStore = tx.objectStore(StoreName.LIMIT)
        const actionStore = tx.objectStore(StoreName.ACTION)
        userStore.delete(limit.id)
        actionStore.add(action.dto())
    }

    static async getAllByTravelId(context: Context, id: string){
        const user = context.user
        if(!user) throw UserError.unauthorized()

        const limits_obj = await DB.getManyFromIndex<LimitType>(StoreName.LIMIT, IndexName.PRIMARY_ENTITY_ID, id)
        return limits_obj.map(l => new Limit(l, user))
    }
}