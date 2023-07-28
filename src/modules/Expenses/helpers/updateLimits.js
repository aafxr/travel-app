import constants from "../../../static/constants";
import toArray from "../../../utils/toArray";


/**
 * возвращает массив существующих в бд limits
 * @param {ActionController} controller
 * @param {string} primary_entity_id
 * @param {Array.<string>} sectionIdList
 * @returns {Promise<[]>}
 */
export default async function updateLimits(controller, primary_entity_id,sectionIdList){
    if (controller) {
        if (sectionIdList) {
            return toArray(await limitsFromArray(controller, primary_entity_id, sectionIdList))
        } else {
            const limits = await controller.read({
                storeName: constants.store.LIMIT,
                index: constants.indexes.PRIMARY_ENTITY_ID,
                query: primary_entity_id
            })
            return toArray(limits)
        }
    }
    return []
}



/**
 * функция осуществляет поиск объектов по списку ID из массива arr
 * @param {ActionController} controller
 * @param {string} primary_entity_id
 * @param {Array.<string>} arr
 * @returns {Promise<*[]>}
 */
async function limitsFromArray(controller,
                               primary_entity_id, arr) {
    let items = await controller.read({
        storeName: constants.store.LIMIT,
        index: constants.indexes.PRIMARY_ENTITY_ID,
        query: primary_entity_id
    })

    items = Array.isArray(items) ? items : [items]

    return items.filter(l => arr.includes(l.section_id))
}