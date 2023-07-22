import constants from "../db/constants";
import toArray from "../../../utils/toArray";

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
}


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
