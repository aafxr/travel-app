import {Action, Expense, Limit, User} from "../StoreEntities";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {ExpenseType} from "../../types/ExpenseType";
import {ActionName} from "../../types/ActionsType";
import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";
import {LimitType} from "../../types/LimitType";
import {UserError, LimitError} from "../errors";
import {TravelService} from "./TravelService";
import {Context} from "../Context/Context";
import {TravelError} from "../errors";
import {DB} from "../db/DB";


async function getValidLimit(limit: Partial<LimitType> & Pick<LimitType, 'section_id' | 'primary_entity_id' | 'value' | 'id'>, user: User) {
    const newLimit = new Limit(limit, user)
    const personalLimitFlag = Limit.isPersonal(newLimit, user)
    const cursor = await DB.openCursor<ExpenseType>(StoreName.EXPENSE)
    let next_exp = (await cursor.next()).value
    let total = 0

    while (next_exp) {
        if (next_exp.primary_entity_id !== limit.primary_entity_id || next_exp.variant !== "expenses_plan") {
            next_exp = (await cursor.next()).value
            continue
        }
        const exp: Expense = new Expense(next_exp, user)
        if (personalLimitFlag && Expense.isPersonal(exp, user)) total += exp.valueOf()
        else if (!personalLimitFlag && !Expense.isPersonal(exp, user)) total += exp.valueOf()
        next_exp = (await cursor.next()).value
    }
    if (limit.value < total) throw LimitError.limitPlanMustBeGreaterThen(total, user.currency)
    return newLimit
}


export class LimitService {

    static async create(limit: Partial<LimitType> & Pick<LimitType, 'section_id' | 'primary_entity_id' | 'value' | 'id'>, user: User | undefined) {
        if (!user) throw UserError.unauthorized()

        const newLimit = await getValidLimit(limit, user)
        await DB.writeWithAction(StoreName.LIMIT, newLimit, user.id, ActionName.ADD)
        return newLimit
    }


    static async update(limit: Limit, user: User) {
        if (!user) throw UserError.unauthorized()

        const newLimit = await getValidLimit(limit, user)
        await DB.writeWithAction(StoreName.LIMIT, newLimit, user.id, ActionName.UPDATE)
        return user
    }


    static async delete(context: Context, limit: Limit) {
        const user = context.user
        if (!user) throw UserError.unauthorized()

        if (!Limit.isPersonal(limit, user)) {
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
        actionStore.add(action)
    }


    static async getAllByTravelId(context: Context, id: string) {
        const user = context.user
        if (!user) throw UserError.unauthorized()

        const limits_obj = await DB.getManyFromIndex<LimitType>(StoreName.LIMIT, IndexName.PRIMARY_ENTITY_ID, id)
        return limits_obj.map(l => new Limit(l, user))
    }

    /** обновление лимита если планы больше текущего лимита */
    static async updateWithNewExpense(expense: Expense, user: User) {
        if (expense.variant !== 'expenses_plan') return

        const cursor = DB.openIndexCursor<ExpenseType>(StoreName.EXPENSE, IndexName.PRIMARY_ENTITY_ID, expense.primary_entity_id)
        let expenseObj = (await cursor.next()).value
        let total = 0

        while (expenseObj) {
            if (expenseObj.variant !== "expenses_plan") {
                expenseObj = (await cursor.next()).value
                continue
            }

            const e = new Expense(expenseObj, user)
            if (expense.section_id !== e.section_id && Expense.isPersonal(expense, user) !== Expense.isPersonal(e, user)) {
                expenseObj = (await cursor.next()).value
                continue
            }
            total += e.value
            expenseObj = (await cursor.next()).value
        }
        let limit: LimitType | undefined
        if (Expense.isPersonal(expense, user)) limit = await DB.getOne<LimitType>(StoreName.LIMIT, `${user.id}:${expense.primary_entity_id}`)
        else limit = await DB.getOne<LimitType>(StoreName.LIMIT, `${expense.section_id}:${expense.primary_entity_id}`)

        if (!limit) {
            const id = Expense.isPersonal(expense,user)
                ? `${user.id}:${expense.section_id}:${expense.primary_entity_id}`
                : `${expense.section_id}:${expense.primary_entity_id}`

            const newLimit = new Limit({
                id,
                section_id: expense.section_id,
                value: total,
                primary_entity_id: expense.primary_entity_id,
                personal: Expense.isPersonal(expense, user) ? 1 : 0
            }, user)

            await DB.writeWithAction(StoreName.LIMIT, newLimit, user.id, ActionName.ADD)
        } else {
            if (limit.value < total) {
                limit.value = total
                const l = new Limit(limit, user)
                await DB.writeWithAction(StoreName.LIMIT, l, user.id, ActionName.UPDATE)
            }
        }

    }
}