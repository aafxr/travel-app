import constants from "../db/constants";
import toArray from "../../../utils/toArray";

export default async function updateLimits(controller, primary_entity_id,sectionIdList){



    if (controller) {
        if (sectionIdList) {
            return toArray(await limitsFromArray(controller, sectionIdList))
        } else {
            const limits = await controller.read({
                storeName: constants.store.LIMIT,
                index: constants.indexes.PRIMARY_ENTITY_ID,
                query: primary_entity_id
            })
            return toArray(limits)
        }
    }
}

async function limitsFromArray(controller, arr) {
    let items = await controller.read({
        storeName: constants.store.LIMIT,
        index: constants.indexes.PRIMARY_ENTITY_ID,
        query: 'all'
    })

    items = Array.isArray(items) ? items : [items]

    return items.filter(l => arr.includes(l.section_id))
}