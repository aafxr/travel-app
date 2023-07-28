import toArray from "../../../utils/toArray";
import constants from "../../../static/constants";

export default async function updateTravels(controller) {
    if (controller) {
        const travels = await controller.read({
            storeName: constants.store.TRAVEL,
            query: 'all'
        })
        return toArray(travels)
    }
    return []
}
