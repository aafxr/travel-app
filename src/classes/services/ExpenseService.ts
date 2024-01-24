import {Action, Expense, ExpenseActual, ExpensePlan, User} from "../StoreEntities";
import {ExpenseType, ExpenseVariantType} from "../../types/ExpenseType";
import {ActionName} from "../../types/ActionsType";
import {StoreName} from "../../types/StoreName";
import {DB} from "../../db/DB";
import {TravelService} from "./TravelService";
import {ExpenseError} from "../errors/ExpenseError";

export class ExpenseService {

    static async create(expense: Partial<ExpenseType> | undefined, user: User, variant: ExpenseVariantType = "expenses_actual") {
        let newExpense: Expense
        if (expense) {
            if (variant === "expenses_actual") newExpense = new ExpenseActual(expense, user.id)
            else newExpense = new ExpensePlan(expense, user.id)
        } else {
            newExpense = new Expense({}, user.id)
        }

        const action = new Action(newExpense, newExpense.id, newExpense.variant as StoreName, ActionName.ADD)
        const tx = await DB.transaction([StoreName.EXPENSE, StoreName.ACTION])
        const expenseStore = tx.objectStore(StoreName.EXPENSE)
        const actionStore = tx.objectStore(StoreName.ACTION)
        expenseStore.add(newExpense.dto())
        actionStore.add(action.dto())
        return newExpense

    }

    static async update(expense: Expense, user: User) {
        if (!expense.isPersonal(user)) {
            const travel = await TravelService.getById(expense.primary_entity_id)
            if (!travel) throw ExpenseError.unexpectedTravelId(expense.primary_entity_id)
            if (travel.canChange(user)) throw ExpenseError.permissionDenied()
        }
        const action = new Action(expense, user.id, expense.variant as StoreName, ActionName.UPDATE)
        const tx = await DB.transaction([StoreName.EXPENSE, StoreName.ACTION])
        const expenseStore = tx.objectStore(StoreName.EXPENSE)
        const actionStore = tx.objectStore(StoreName.ACTION)
        expenseStore.put(expense.dto())
        actionStore.add(action.dto())
        return expense
    }

    static async delete(expense: Expense, user: User) {
        if (!expense.isPersonal(user)) {
            const travel = await TravelService.getById(expense.primary_entity_id)
            if (!travel) throw ExpenseError.unexpectedTravelId(expense.primary_entity_id)
            if (travel.canChange(user)) throw ExpenseError.permissionDenied()
        }
        const action = new Action(expense, expense.id, expense.variant as StoreName, ActionName.DELETE)
        const tx = await DB.transaction([StoreName.ACTION, StoreName.EXPENSE])
        const expenseStore = tx.objectStore(StoreName.EXPENSE)
        const actionStore = tx.objectStore(StoreName.ACTION)
        expenseStore.delete(expense.id)
        actionStore.add(action.dto())
    }
}