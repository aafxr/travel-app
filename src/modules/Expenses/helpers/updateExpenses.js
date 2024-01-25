import storeDB from "../../../classes/db/storeDB/storeDB";
import constants from "../../../static/constants";

/**
 * возвращает массив расходов, который на данныый момент есть в бд
 * @param {string} primary_entity_id
 * @param {'plan' | 'actual'} type
 * @returns {Promise<[]|*>}
 */
export default function updateExpenses(primary_entity_id, type = 'plan') {
    const isPlan = type === 'plan'

    const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL
    return new Promise((resolve, reject) => {
        storeDB.onReadySubscribe(() => {
            storeDB.getManyFromIndex(
                storeName,
                constants.indexes.PRIMARY_ENTITY_ID,
                primary_entity_id
            )
                .then(resolve)
                .catch(reject)
        })
    })
}