import {ExpenseType} from "../types/ExpenseType";
import {DBFlagType} from "../types/DBFlagType";
import {CurrencyName} from "../types/CurrencyName";
import {nanoid} from "nanoid";
import {staticIDBMethods} from "../decorators/class-decorators/staticIDBMethods";

/**
 * данный класс позволяет работать с расходами
 */
class Expense implements ExpenseType {
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
        if(expense.id) this.id = expense.id
        if(expense.entity_id) this.entity_id = expense.entity_id
        if(expense.entity_type) this.entity_type = expense.entity_type
        if(expense.primary_entity_id) this.primary_entity_id = expense.primary_entity_id
        if(expense.primary_entity_type) this.primary_entity_type = expense.primary_entity_type
        if(expense.section_id) this.section_id = expense.section_id
        if(expense.title) this.title = expense.title
        if(expense.user_id) this.user_id = expense.user_id
        if(expense.currency) this.currency = expense.currency
        if(expense.created_at) this.created_at = expense.created_at
        if(expense.datetime) this.datetime = expense.datetime
        if(expense.personal) this.personal = expense.personal
        if(expense.value) this.value = expense.value
    }

    setValue(value:number){
        this.value = value
    }

    dto(): ExpenseType{
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


export default staticIDBMethods(Expense)