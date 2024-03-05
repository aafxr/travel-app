import {Action, Expense, Limit, User} from "../StoreEntities";
import {LimitError, TravelError, UserError} from "../errors";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {ActionName} from "../../types/ActionsType";
import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";
import {TravelService} from "./TravelService";
import {Context} from "../Context/Context";
import {Compare} from "../Compare";
import {DB} from "../db/DB";


async function getValidLimit(limit: Partial<Limit> & Pick<Limit, 'section_id' | 'primary_entity_id' | 'value' | 'id'>, user: User) {
    const newLimit = new Limit(limit, user)
    const personalLimitFlag = Limit.isPersonal(newLimit, user)
    const cursor = await DB.openCursor<Expense>(StoreName.EXPENSE)
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



/**
 * сервис позволяет работать с лимитами
 * (создавать, обновлять, удалять, получать список лимитов )
 *
 * ---
 * доступны следующие методы:
 * - create
 * - update
 * - delete
 * - getAllByTravelId
 * - updateWithNewExpense
 * - getByID
 * - writeTransaction
 */
export class LimitService {

    /**
     * метоод позволяет создать новый лимит  сгенерировать action
     * @param limit
     * @param user
     */
    static async create(limit: Partial<Limit> & Pick<Limit, 'section_id' | 'primary_entity_id' | 'value' | 'id'>, user: User | undefined) {
        if (!user) throw UserError.unauthorized()

        const newLimit = await getValidLimit(limit, user)
        const limitObject = {...newLimit} as Partial<Limit>
        delete limitObject['user']

        const action = new Action(limitObject, user.id, StoreName.LIMIT, ActionName.ADD)
        await LimitService.writeTransaction(limitObject, action)
        return newLimit
    }

    /**
     * метод позваляет обновить запись о лимите и создает action с измененной информацией
     * @param limit
     * @param user
     */
    static async update(limit: Limit, user: User) {
        if (!user) throw UserError.unauthorized()

        const oldLimit = await DB.getOne<Limit>(StoreName.LIMIT, limit.id)

        if(!oldLimit) throw LimitError.updateBeforeCreate()

        const newLimit = await getValidLimit(limit, user)

        const change = Compare.objects(oldLimit, newLimit, ["id", "primary_entity_id"], ['user'])

        const action = new Action(change, user.id, StoreName.LIMIT, ActionName.UPDATE)

        await LimitService.writeTransaction(change, action)

        return user
    }

    /**
     * метод позволяет удалить лимит и генерирует action
     * @param context
     * @param limit
     */
    static async delete(context: Context, limit: Limit) {
        const user = context.user
        if (!user) throw UserError.unauthorized()

        if (!Limit.isPersonal(limit, user)) {
            const travel = await TravelService.getById(limit.primary_entity_id)
            if (!travel) throw TravelError.unexpectedTravelId(limit.primary_entity_id)
            if (!travel.permitDelete(user)) throw TravelError.permissionDeniedDeleteTravel()
        }

        const {id, primary_entity_id} = limit
        const action = new Action({id, primary_entity_id} as Limit, user.id, StoreName.LIMIT, ActionName.DELETE)
        await LimitService.writeTransaction(limit, action, true)
    }

    /**
     * метод возвращает список всех лимитов для данного путешествия
     * @param context
     * @param id ид путешествия
     */
    static async getAllByTravelId(context: Context, id: string) {
        const user = context.user
        if (!user) throw UserError.unauthorized()

        const limits_obj = await DB.getManyFromIndex<Limit>(StoreName.LIMIT, IndexName.PRIMARY_ENTITY_ID, id)
        return limits_obj.map(l => new Limit(l, user))
    }

    /** обновление лимита если планы больше текущего лимита */
    static async updateWithNewExpense(expense: Expense, user: User) {
        if (expense.variant !== 'expenses_plan') return

        const cursor = DB.openIndexCursor<Expense>(StoreName.EXPENSE, IndexName.PRIMARY_ENTITY_ID, expense.primary_entity_id)

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

            // const exch = await ExchangeService.getExchangeCourse( new Date(e.datetime.getTime() - MS_IN_DAY), e.datetime,)
            // const key = e.datetime.toLocaleDateString()

            // const coef = exch[key]?.find(ex => ex.char_code  === e.currency)?.value || 1

            total += e.value
            expenseObj = (await cursor.next()).value
        }
        let limit: Limit | undefined
        if (Expense.isPersonal(expense, user)) limit = await DB.getOne<Limit>(StoreName.LIMIT, `${user.id}:${expense.primary_entity_id}`)
        else limit = await DB.getOne<Limit>(StoreName.LIMIT, `${expense.section_id}:${expense.primary_entity_id}`)

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
                const l = new Limit(limit, user)
                l.value = total

                const change = Compare.objects(limit, l, ["id", "primary_entity_id"], ['user'])

                const action = new Action(change, user.id, StoreName.LIMIT, ActionName.UPDATE)

                await LimitService.writeTransaction(limit, action)
            }
        }

    }

    /**
     * метод возвращает запись о лимите в локалльной бд 
     * @param user
     * @param limitID
     */
    static async getByID(user: User, limitID: string, ){
        const limit = await DB.getOne<Limit>(StoreName.LIMIT, limitID)
        if(limit) return new Limit(limit, user)
    }


    static async writeTransaction(limit: Partial<Limit>, action: Action<Partial<Limit>>, isDelete = false){
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.LIMIT, StoreName.ACTION], 'readwrite')
        const limitStore = tx.objectStore(StoreName.LIMIT)
        const actionStore = tx.objectStore(StoreName.ACTION)
        isDelete
            ? limitStore.delete(limit?.id || '')
            : limitStore.put(limit)
        actionStore.add(action)
    }
}