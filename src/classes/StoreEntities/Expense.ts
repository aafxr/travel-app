import {nanoid} from "nanoid";

import {CurrencyName} from "../../types/CurrencyName";
import {ExpenseType} from "../../types/ExpenseType";
import {DBFlagType} from "../../types/DBFlagType";
import {StoreName} from "../../types/StoreName";
import {StorageEntity} from "./StorageEntity";

/**
 * данный класс позволяет работать с расходами
 */
abstract class Expense extends StorageEntity implements ExpenseType{
    abstract storeName: StoreName;
    withAction = true

    id = nanoid(7);
    entity_id = '';
    entity_type = '';
    primary_entity_id = '';
    primary_entity_type = '';
    section_id = '';
    title = '';
    user_id = '';
    currency: CurrencyName = CurrencyName.RUB;
    created_at = new Date();
    datetime = new Date();
    personal: DBFlagType = 0;
    value = 0;

    constructor(expense: Partial<ExpenseType | Expense>) {
        super()
        if (expense.id) this.id = expense.id
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

    setCurrency(currency: CurrencyName) {
        this.currency = currency
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

    dto(): ExpenseType {
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
    storeName: StoreName = StoreName.EXPENSES_ACTUAL;
}


class ExpensePlan extends Expense {
    storeName: StoreName = StoreName.EXPENSES_PLAN
}


export {
    Expense
    , ExpenseActual
    , ExpensePlan
}