import {Action, Expense, ExpenseActual, ExpensePlan, User} from "../StoreEntities";
import {ExpenseType, ExpenseVariantType} from "../../types/ExpenseType";
import {openIDBDatabase} from "../db/openIDBDatabaase";
import {ExpenseError, TravelError} from "../errors";
import {ActionName} from "../../types/ActionsType";
import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";
import {UserError} from "../errors/UserError";
import {TravelService} from "./TravelService";
import {Context} from "../Context/Context";
import {DB} from "../db/DB";
import {ExchangeService} from "./ExchangeService";
import {Exchange} from "../StoreEntities/Exchange";

export class ExpenseService {

    static async create(ctx:Context, expense: Partial<ExpenseType> | undefined, user: User, variant: ExpenseVariantType = "expenses_actual") {
        let newExpense: Expense
        if (expense) {
            if (variant === "expenses_actual") newExpense = new ExpenseActual(expense, user)
            else newExpense = new ExpensePlan(expense, user)
        } else {
            newExpense = new Expense({}, user)
        }

        const action = new Action(newExpense, newExpense.id, newExpense.variant as StoreName, ActionName.ADD)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.EXPENSE, StoreName.ACTION], 'readwrite')
        const expenseStore = tx.objectStore(StoreName.EXPENSE)
        const actionStore = tx.objectStore(StoreName.ACTION)
        expenseStore.add(newExpense.dto())
        actionStore.add(action.dto())
        return newExpense

    }

    static async update(expense: Expense, user: User) {
        if (!expense.isPersonal(user)) {
            const travel = await TravelService.getById(expense.primary_entity_id)
            if (!travel) throw TravelError.unexpectedTravelId(expense.primary_entity_id)
            if (travel.permitChange(user)) throw ExpenseError.permissionDenied()
        }
        const action = new Action(expense, user.id, expense.variant as StoreName, ActionName.UPDATE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.EXPENSE, StoreName.ACTION], 'readwrite')
        const expenseStore = tx.objectStore(StoreName.EXPENSE)
        const actionStore = tx.objectStore(StoreName.ACTION)
        expenseStore.put(expense.dto())
        actionStore.add(action.dto())
        return expense
    }

    static async delete(expense: Expense, user: User) {
        if (!expense.isPersonal(user)) {
            const travel = await TravelService.getById(expense.primary_entity_id)
            if (!travel) throw TravelError.unexpectedTravelId(expense.primary_entity_id)
            if (travel.permitChange(user)) throw ExpenseError.permissionDenied()
        }
        const action = new Action(expense, expense.id, expense.variant as StoreName, ActionName.DELETE)
        const db = await openIDBDatabase()
        const tx = db.transaction([StoreName.EXPENSE, StoreName.ACTION], 'readwrite')
        const expenseStore = tx.objectStore(StoreName.EXPENSE)
        const actionStore = tx.objectStore(StoreName.ACTION)
        expenseStore.delete(expense.id)
        actionStore.add(action.dto())
    }

    static async getAllByTravelId(ctx: Context,travelId:string): Promise<Expense[]>{
        const user = ctx.user
        if (!user) throw UserError.unauthorized()

        const expenses_type_list = await DB.getManyFromIndex<ExpenseType>(StoreName.EXPENSE, IndexName.PRIMARY_ENTITY_ID, travelId)
        const expenses = expenses_type_list.map(e => new Expense(e, user))
        if(!expenses.length) return []

        const exchange = await ExchangeService.initExpensesExchange(expenses)
        /////дополнить расходы курсом валют
        for (const e of expenses){
            const key = e.created_at.toLocaleDateString()
            const ex = exchange[key]
            e.setExchanger(new Exchange({date: e.created_at.getTime(), value: ex}))
        }

        return expenses
    }
}