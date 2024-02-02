import {Action, Expense, Limit, User} from "../StoreEntities";
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
import {ExpenseType} from "../../types/ExpenseType";
import {LimitError} from "../errors/LimitError";


async function getValidLimit(limit: Partial<LimitType> & Pick<LimitType, 'section_id' | 'primary_entity_id' | 'value'>, user: User) {
    const newLimit = new Limit(limit, user)
    const personalLimitFlag = newLimit.isPersonal(user)
    const cursor = await DB.openCursor<ExpenseType>(StoreName.EXPENSE)
    let next_exp = (await cursor.next()).value
    let total = 0

    while (next_exp) {
        if (next_exp.primary_entity_id !== limit.primary_entity_id || next_exp.variant !== "expenses_plan") {
            next_exp = (await cursor.next()).value
            continue
        }
        const exp: Expense = new Expense(next_exp, user)
        if (personalLimitFlag && exp.isPersonal(user)) total += exp.valueOf()
        else if (!personalLimitFlag && !exp.isPersonal(user)) total += exp.valueOf()
        next_exp = (await cursor.next()).value
    }
    if (limit.value < total) throw LimitError.limitPlanMustBeGreaterThen(total, user.currency)
    return newLimit
}


export class LimitService {

    static async create(context: Context, limit: Partial<LimitType> & Pick<LimitType, 'section_id' | 'primary_entity_id' | 'value'>) {
        const user = context.user
        if (!user) throw UserError.unauthorized()

        const newLimit = await getValidLimit(limit, user)
        const action = new Action(newLimit, user.id, StoreName.LIMIT, ActionName.ADD)
        await DB.writeAll([newLimit, action])
        return newLimit
    }


    static async update(context: Context, limit: Limit) {
        const user = context.user
        if (!user) throw UserError.unauthorized()

        const newLimit = await getValidLimit(limit, user)
        const action = new Action(limit, user.id, StoreName.LIMIT, ActionName.UPDATE)
        await DB.writeAll([newLimit, action])
        return user
    }


    static async delete(context: Context, limit: Limit) {
        const user = context.user
        if (!user) throw UserError.unauthorized()

        if (!limit.isPersonal(user)) {
            const travel = await TravelService.getById(limit.primary_entity_id)
            if (!travel) throw TravelError.unexpectedTravelId(limit.primary_entity_id)
            if (!travel.permitDelete(user)) throw TravelError.permissionDeniedDeleteTravel()
        }
        const action = new Action(user, user.id, StoreName.LIMIT, ActionName.DELETE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.LIMIT, StoreName.ACTION], 'readwrite')
        const limitStore = tx.objectStore(StoreName.LIMIT)
        const actionStore = tx.objectStore(StoreName.ACTION)
        limitStore.delete(limit.id)
        actionStore.add(action.dto())
    }

    static async getAllByTravelId(context: Context, id: string) {
        const user = context.user
        if (!user) throw UserError.unauthorized()

        const limits_obj = await DB.getManyFromIndex<LimitType>(StoreName.LIMIT, IndexName.PRIMARY_ENTITY_ID, id)
        return limits_obj.map(l => new Limit(l, user))
    }
}