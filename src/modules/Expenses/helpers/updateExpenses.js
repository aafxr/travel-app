import constants from "../db/constants";
import toArray from "../../../utils/toArray";

/**
 * возвращает массив расходов, который на данныый момент есть в бд
 * @param {ActionController} controller
 * @param {string} primary_entity_id
 * @param {'plan' | 'actual'} type
 * @returns {Promise<[]|*>}
 */
export default async function updateExpenses(controller, primary_entity_id, type = 'plan') {
    const isPlan = type === 'plan'

    if (controller) {
        const storeName = isPlan ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL
        const expenses = await controller.read({
            storeName,
            index: constants.indexes.PRIMARY_ENTITY_ID,
            query: primary_entity_id
        })
        return toArray(expenses)
    }
    return []
}