import {nanoid} from "nanoid";

import {ExpenseType, ExpenseVariantType} from "../../types/ExpenseType";
import {DBFlagType} from "../../types/DBFlagType";
import {StoreEntity} from "./StoreEntity";
import {Member} from "./Member";
import {CurrencyName} from "../../types/CurrencyTypes";
import {Exchange} from "./Exchange";
import {User} from "./User";


/**
 * данный класс позволяет работать с расходами
 */
class Expense extends StoreEntity implements ExpenseType {

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
    exchanger!: Exchange

    user: User

    constructor(expense: Partial<ExpenseType | Expense>, user: User) {
        super()
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

        this.setExchanger(new Exchange())

        this.user.subscribe("currency", (u) => this.setCurrency(u.currency))

    }


    setId(id: string) {
        this.id = id
    }

    setEntity_id(entity_id: string) {
        this.entity_id = entity_id
    }

    setEntity_type(entity_type: string) {
        this.entity_type = entity_type
    }

    setPrimary_entity_id(primary_entity_id: string) {
        this.primary_entity_id = primary_entity_id
    }

    setPrimary_entity_type(primary_entity_type: string) {
        this.primary_entity_type = primary_entity_type
    }

    setSection_id(section_id: string) {
        this.section_id = section_id
    }

    setTitle(title: string) {
        this.title = title
    }

    setUser_id(user_id: string) {
        this.user_id = user_id
    }

    setCurrency(currency: keyof CurrencyName) {
        this.currency = currency
        this.coeff = this.exchanger.getCoefficient(currency)
        this.emit('update', [this])
    }

    setDatetime(datetime: Date) {
        this.datetime = new Date(datetime)
    }

    setPersonal(personal: DBFlagType) {
        this.personal = personal
    }

    setValue(value: number) {
        this.value = value
    }

    isPersonal<T extends Member>(user: T) {
        return this.personal === 1 && this.id.split(':').pop() === user.id
    }

    isCommon() {
        return this.personal === 0
    }

    setCoeff(n: number) {
        this.coeff = n
        this.emit('update', [this])
    }

    setExchanger(ex: Exchange) {
        this.exchanger = ex
        let unsub = ex.subscribe('update', (e) => {
            unsub()
            this.setCoeff(e.getCoefficient(this.user.currency))
        })
    }

    valueOf(){
        return this.value * this.coeff
    }

    dto(): Omit<ExpenseType, 'variant'> {
        return {
            id: this.id,
            entity_id: this.entity_id,
            entity_type: this.entity_type,
            primary_entity_id: this.primary_entity_id,
            primary_entity_type: this.primary_entity_type,
            section_id: this.section_id,
            title: this.title,
            user_id: this.user_id,
            currency: this.currency,
            created_at: this.created_at,
            datetime: this.datetime,
            personal: this.personal,
            value: this.value,
        }
    }
}



class ExpenseActual extends Expense {
    variant: ExpenseVariantType = "expenses_actual";

}


class ExpensePlan extends Expense {
    variant: ExpenseVariantType = "expenses_plan";

}


export {Expense, ExpenseActual, ExpensePlan}