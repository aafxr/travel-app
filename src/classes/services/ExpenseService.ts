import {Action, Expense, Travel, User} from "../StoreEntities";
import {ExpenseError, TravelError, UserError} from "../errors";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {ExpenseType} from "../../types/ExpenseType";
import {ActionName} from "../../types/ActionsType";
import {Exchange} from "../StoreEntities/Exchange";
import {ExchangeService} from "./ExchangeService";
import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";
import {TravelService} from "./TravelService";
import {LimitService} from "./LimitService";
import {Context} from "../Context/Context";
import {DB} from "../db/DB";

export class ExpenseService {

    static async create(expense: Expense, user: User) {
        await DB.writeWithAction(StoreName.EXPENSE, expense, user.id, ActionName.ADD)
        await LimitService.updateWithNewExpense(expense, user)
        return expense

    }

    static async update(expense: Expense, user: User) {
        if (!Expense.isPersonal(expense, user)) {
            const travel = await TravelService.getById(expense.primary_entity_id)
            if (!travel) throw TravelError.unexpectedTravelId(expense.primary_entity_id)
            if (!Travel.isMember(travel, user)) throw ExpenseError.permissionDenied()
        }
        const action = new Action(expense, user.id, expense.variant as StoreName, ActionName.UPDATE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.EXPENSE, StoreName.ACTION], 'readwrite')
        const expenseStore = tx.objectStore(StoreName.EXPENSE)
        const actionStore = tx.objectStore(StoreName.ACTION)
        expenseStore.put(expense)
        actionStore.add(action)
        await LimitService.updateWithNewExpense(expense, user)
        return expense
    }

    static async delete(expense: Expense, user: User) {
        // if (!Expense.isPersonal(expense,user)) {
        //     const travel = await TravelService.getById(expense.primary_entity_id)
        //     if (!travel) throw TravelError.unexpectedTravelId(expense.primary_entity_id)
        //     if (travel.permitChange(user)) throw ExpenseError.permissionDenied()
        // }
        const action = new Action(expense, expense.id, expense.variant as StoreName, ActionName.DELETE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.EXPENSE, StoreName.ACTION], 'readwrite')
        const expenseStore = tx.objectStore(StoreName.EXPENSE)
        const actionStore = tx.objectStore(StoreName.ACTION)
        expenseStore.delete(expense.id)
        actionStore.add(action)
    }

    static async getAllByTravelId(ctx: Context,travelId:string): Promise<Expense[]>{
        const user = ctx.user
        if (!user) throw UserError.unauthorized()

        const expenses_type_list = await DB.getManyFromIndex<ExpenseType>(StoreName.EXPENSE, IndexName.PRIMARY_ENTITY_ID, travelId)
        const expenses = expenses_type_list.map(e => new Expense(e, user))
        if(!expenses.length) return []

        // const exchange = await ExchangeService.initExpensesExchange(expenses)
        /////дополнить расходы курсом валют
        // for (const e of expenses){
        //     const key = e.created_at.toLocaleDateString()
        //     const ex = exchange[key]
        //     Expense.setExchange(e, new Exchange({date: e.created_at.getTime(), value: ex}), user)
        // }
        return expenses
    }

    static async getById(id:string, user: User){
        const ex = await DB.getOne<ExpenseType>(StoreName.EXPENSE, id)
        if(ex) return new Expense(ex, user)
    }
}