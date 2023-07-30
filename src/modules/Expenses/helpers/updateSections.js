import constants from "../../../static/constants";
import toArray from "../../../utils/toArray";


/**
 * возвращает массив существующих в бд sections
 * @param {ActionController} controller
 * @param {Array.<string>} [sectionIdList]
 * @returns {Promise<[]>}
 */
export default async function updateSections(controller, sectionIdList){
    if (controller) {
        if (sectionIdList) {
            return await sectionsFromArray(controller, sectionIdList)
        } else {
            const sections = await controller.read({
                storeName: constants.store.SECTION,
                action: 'get',
                query: 'all'
            })

            return toArray(sections)
        }

    }
    return []
}


/**
 * функция осуществляет поиск объектов по списку ID из массива arr
 * @param {ActionController} controller
 * @param {Array.<string>} arr
 * @returns {Promise<*[]>}
 */
async function sectionsFromArray(controller, arr){
    const result = []
    for (const id of arr) {
        await controller.read({
            storeName: constants.store.SECTION,
            action: 'get',
            id
        })
            .then(item => item && result.push(item))
    }
    return result
}
