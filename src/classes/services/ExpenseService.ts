import {Action, Expense, Travel, User} from "../StoreEntities";
import {ExpenseError, TravelError, UserError} from "../errors";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {ExpenseType} from "../../types/ExpenseType";
import {ActionName} from "../../types/ActionsType";
import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";
import {TravelService} from "./TravelService";
import {LimitService} from "./LimitService";
import {Context} from "../Context/Context";
import {Compare} from "../Compare";
import {DB} from "../db/DB";
import {SMEType} from "../../contexts/SocketContextProvider/SMEType";


/**
 * сервис позволяет работать с расходами
 * (создавать, удалять, обнавлять)
 *
 * ---
 * содержит следующие методы:
 * - create
 * - update
 * - delete
 * - getAllByTravelId
 * - getById
 * - getTotal
 * - writeTransaction
 */
export class ExpenseService {

    /**
     * метод добавляет запись о расходе в бд и создает соответствующий action
     * @param context
     * @param expense
     * @param user
     */
    static async create(context: Context,  expense: Expense, user: User) {
        const action = new Action(expense, user.id, expense.variant as StoreName, ActionName.ADD)
        await ExpenseService.writeTransaction(expense, action)
        const socket = context.socket
        if(socket) socket.emit(SMEType.EXPENSE_ACTION, action)
        await LimitService.updateWithNewExpense(expense, user)
        return expense
    }

    /**
     * метод обновляет запись о расходе в бд и генерирует соответсвующий action
     * @param context
     * @param expense
     * @param user
     */
    static async update(context: Context, expense: Expense, user: User) {
        if (!Expense.isPersonal(expense, user)) {
            const travel = await TravelService.getById(expense.primary_entity_id)
            if (!travel) throw TravelError.unexpectedTravelId(expense.primary_entity_id)
            if (!Travel.isMember(travel, user)) throw ExpenseError.permissionDenied()
        }

        const oldExpense = await DB.getOne<Expense>(StoreName.EXPENSE, expense.id)

        if(!oldExpense) throw ExpenseError.updateBeforeCreate()

        const changed = Compare.objects(oldExpense, expense, ['id', 'primary_entity_id'], ["user"])

        const action = new Action(changed, user.id, expense.variant as StoreName, ActionName.UPDATE)
        await ExpenseService.writeTransaction(expense, action)
        const socket = context.socket
        if(socket) socket.emit(SMEType.EXPENSE_ACTION, action)
        await LimitService.updateWithNewExpense(expense, user)
        return expense
    }

    /**
     * мметод удляет запись о расходе и создает соответствующий action
     * @param context
     * @param expense
     * @param user
     */
    static async delete(context: Context, expense: Expense, user: User) {
        // if (!Expense.isPersonal(expense,user)) {
        //     const travel = await TravelService.getById(expense.primary_entity_id)
        //     if (!travel) throw TravelError.unexpectedTravelId(expense.primary_entity_id)
        //     if (travel.permitChange(user)) throw ExpenseError.permissionDenied()
        // }
        const {id,primary_entity_id} = expense

        const action = new Action({id,primary_entity_id} as Expense, user.id, expense.variant as StoreName, ActionName.DELETE)
        const socket = context.socket
        if(socket) socket.emit(SMEType.EXPENSE_ACTION, action)
        await ExpenseService.writeTransaction(expense, action, true)
    }

    /**
     * метод позваляет загрузить спсок расходов для указанного путешествия
     * @param ctx
     * @param travelId
     */
    static async getAllByTravelId(ctx: Context, travelId: string): Promise<Expense[]> {
        const user = ctx.user
        if (!user) throw UserError.unauthorized()

        const expenses_type_list = await DB.getManyFromIndex<ExpenseType>(StoreName.EXPENSE, IndexName.PRIMARY_ENTITY_ID, travelId)
        const expenses = expenses_type_list.map(e => new Expense(e, user))
        if (!expenses.length) return []

        // const exchange = await ExchangeService.initExpensesExchange(expenses)
        /////дополнить расходы курсом валют
        // for (const e of expenses){
        //     const key = e.created_at.toLocaleDateString()
        //     const ex = exchange[key]
        //     Expense.setExchange(e, new Exchange({date: e.created_at.getTime(), value: ex}), user)
        // }
        return expenses
    }

    static async getById(id: string, user: User) {
        const ex = await DB.getOne<ExpenseType>(StoreName.EXPENSE, id)
        if (ex) return new Expense(ex, user)
    }


    /**
     * метод подсчитывает сумму всех расходов указанной секции
     * @param user
     * @param travel
     * @param section_id
     * @param personal
     * @param variant
     */
    static async getTotal(user: User, travel: Travel, section_id: string, personal: boolean, variant: Expense['variant'] = "expenses_plan") {
        const cursor = DB.openIndexCursor<Expense>(StoreName.EXPENSE, IndexName.PRIMARY_ENTITY_ID, travel.id)
        let total = 0
        let expense = (await cursor.next()).value
        while (expense) {
            if (expense.section_id !== section_id) {
                expense = (await cursor.next()).value
                continue
            }
            if (Expense.isPersonal(expense, user) !== personal) {
                expense = (await cursor.next()).value
                continue
            }
            if (expense.variant !== variant) {
                expense = (await cursor.next()).value
                continue
            }

            total += expense.value

            expense = (await cursor.next()).value
        }
        return total
    }

    /**
     * транзакция для записи расхода экшена
     * @param expense
     * @param action
     * @param isDelete
     */
    static async writeTransaction(expense:Expense, action: Action<Partial<Expense>>, isDelete = false){
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.EXPENSE, StoreName.ACTION], 'readwrite')
        const expenseStore = tx.objectStore(StoreName.EXPENSE)
        const actionStore = tx.objectStore(StoreName.ACTION)
        isDelete
            ? expenseStore.delete(expense.id)
            : expenseStore.put(expense)
        actionStore.add(action)
    }
}