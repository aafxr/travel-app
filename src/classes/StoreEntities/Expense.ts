import {nanoid} from "nanoid";

import {ExpenseType, ExpenseVariantType} from "../../types/ExpenseType";
import {CurrencyName} from "../../contexts/ExchangeContext";
import {DBFlagType} from "../../types/DBFlagType";
import {Exchange} from "./Exchange";
import {Member} from "./Member";
import {User} from "./User";


/**
 * данный класс позволяет работать с расходами
 *
 * Содержит поля:
 *
 * __id__,
 * __entity_id__,
 * __entity_type__,
 * __primary_entity_id__,
 * __primary_entity_type__,
 * __section_id__,
 * __title__,
 * __user_id__,
 * __currency__,
 * __created_at__,
 * __datetime__,
 * __personal__,
 * __value__,
 * __variant__
 */
class Expense {

    id: string;
    entity_id = '';
    entity_type = '';
    primary_entity_id = '';
    primary_entity_type = '';
    section_id = '';
    title = '';
    user_id = '';
    currency: keyof CurrencyName = 'RUB';
    created_at = new Date();
    datetime = new Date();
    personal: DBFlagType = 0;
    value = 0;
    variant: ExpenseVariantType = "expenses_actual";

    coeff = 1

    user: User

    constructor(expense: Partial<ExpenseType | Expense>, user: User) {
        this.user = user

        if (expense.id) this.id = expense.id
        else this.id = `${user.id}:${nanoid(7)}`
        if (expense.entity_id) this.entity_id = expense.entity_id
        if (expense.entity_type) this.entity_type = expense.entity_type
        if (expense.primary_entity_id) this.primary_entity_id = expense.primary_entity_id
        if (expense.primary_entity_type) this.primary_entity_type = expense.primary_entity_type
        if (expense.section_id) this.section_id = expense.section_id
        if (expense.title) this.title = expense.title
        if (expense.user_id) this.user_id = expense.user_id
        if (expense.currency) this.currency = expense.currency
        if (expense.created_at) this.created_at = expense.created_at
        if (expense.datetime) this.datetime = expense.datetime
        if (expense.personal) this.personal = expense.personal
        if (expense.value) this.value = expense.value
        if (expense.variant) this.variant = expense.variant

    }


    static setId(expense: Expense, id: string) {
        expense.id = id
    }

    static setEntity_id(expense: Expense, entity_id: string) {
        expense.entity_id = entity_id
    }

    static setEntity_type(expense: Expense, entity_type: string) {
        expense.entity_type = entity_type
    }

    static setPrimary_entity_id(expense: Expense, primary_entity_id: string) {
        expense.primary_entity_id = primary_entity_id
    }

    static setPrimary_entity_type(expense: Expense, primary_entity_type: string) {
        expense.primary_entity_type = primary_entity_type
    }

    static setSection_id(expense: Expense, section_id: string) {
        expense.section_id = section_id
    }

    static setTitle(expense: Expense, title: string) {
        expense.title = title
    }

    static setUser_id(expense: Expense, user_id: string) {
        expense.user_id = user_id
    }

    static setCurrency(expense: Expense, currency: keyof CurrencyName, exchange ?: Exchange) {
        expense.currency = currency
        if (exchange) {
            expense.coeff = exchange.getCoefficient(currency)
        } else {
            expense.coeff = 1
        }
    }

    static setDatetime(expense: Expense, datetime: Date) {
        expense.datetime = new Date(datetime)
    }

    static setPersonal(expense: Expense, personal: DBFlagType) {
        expense.personal = personal
    }

    static setValue(expense: Expense, value: number) {
        expense.value = value
    }

    static isPersonal<T extends Member>(expense: Expense, user: T) {
        return expense.personal === 1 && expense.id.split(':').pop() === user.id
    }

    static isCommon(expense: Expense) {
        return expense.personal === 0
    }

    static setCoeff(expense: Expense, n: number) {
        expense.coeff = n
    }

    static setExchange(expense: Expense, ex: Exchange, user: User) {
        Expense.setCoeff(expense, ex.getCoefficient(user.currency || "RUB"))
    }

    valueOf() {
        return this.value * this.coeff
    }
}


class ExpenseActual extends Expense {
    variant: ExpenseVariantType = "expenses_actual";

}


class ExpensePlan extends Expense {
    variant: ExpenseVariantType = "expenses_plan";

}


export {Expense, ExpenseActual, ExpensePlan}