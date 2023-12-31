import constants from "../../../../static/constants";
import createId from "../../../../utils/createId";
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
 * @returns {ExpenseType}
 */
export default function handleAddExpense(isPlan, user_id, primary_entity_type, primary_entity_id, expName, expSum,expCurr, personal, section_id) {
    if (user_id && primary_entity_type) {
        // const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL
        const data =  {
            user_id,
                primary_entity_type: primary_entity_type,
                primary_entity_id,
                entity_type: '',
                entity_id: '',
                title: expName,
                value: Number(expSum),
                currency: expCurr.symbol || '₽',
                personal: personal ? 1 : 0,
                section_id,
                datetime: new Date().toISOString(),
                created_at: new Date().toISOString(),
                id: createId(user_id)
        }

        // await storeDB.editElement(storeName, data)
        // await storeDB.editElement(constants.store.EXPENSES_ACTIONS, createAction(storeName,user_id,'add', data))

        return data
    } else {
        console.warn('need add user_id & primary_entity_type')
    }
    return null
}