import defaultHandleError from "../../../utils/error-handlers/defaultHandleError";
import createId from "../../../utils/createId";

/**
 * Утилита возвращает объект Expense с дефолтнвми полями
 * @function
 * @name defaultExpense
 * @param {string} primary_entity_id
 * @param {string} user_id
 * @returns {ExpenseType}
 */
export default function defaultExpense(primary_entity_id, user_id){
    if(!user_id) {
        const error = new Error('prop  ser_id should be defined')
        defaultHandleError(error, 'Отсутствует ID пользователя')
    }

    return {
        id: createId(user_id),
        value: 0,
        created_at: new Date().toISOString(),
        currency: '₽',
        personal: 0,
        title: '',
        datetime: new Date().toISOString(),
        section_id: 'misc',
        primary_entity_id: primary_entity_id,
        entity_type:'',
        user_id: user_id,
        primary_entity_type: '',
        entity_id: '',
    }
}