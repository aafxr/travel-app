import constants from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import createAction from "../../../../utils/createAction";

/**
 *
 * @param isPlan
 * @param user_id
 * @param primary_entity_type
 * @param primary_entity_id
 * @param expName
 * @param expSum
 * @param expCurr
 * @param personal
 * @param section_id
 * @param expense
 * @returns {Promise<(*&{section_id, personal: (number), currency: (string|string|*), title, value: number})|null>}
 */

export default async function handleEditExpense(isPlan, user_id, primary_entity_type, primary_entity_id, expName, expSum, expCurr, personal, section_id, expense) {
    if (expense && user_id) {
        if (
            expense.title !== expName
            || expense.value !== +expSum
            || expense.personal !== (personal ? 1 : 0)
            || expense.section_id !== section_id
            || expense.currency !== expCurr.symbol
        ) {
            const data = {
                ...expense,
                personal: personal ? 1 : 0,
                title: expName,
                value: +expSum,
                currency: expCurr.symbol,
                section_id
            }

            const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL
            await storeDB.editElement(storeName, data)
            await storeDB.editElement(constants.store.EXPENSES_ACTIONS, createAction(storeName,user_id,'update', data))
            return data
        }
    } else {
        console.warn('need add user_id & primary_entity_type')
    }
    return null
}