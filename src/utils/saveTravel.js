import storeDB from "../classes/db/storeDB/storeDB";
import ErrorReport from "../controllers/ErrorReport";
import constants from "../static/constants";
import changedFields from "./changedFields";
import createAction from "./createAction";

/**
 * Метод для добавления / обновления информации о поездке и добавляет action
 * @function
 * @name saveTravel
 * @param {TravelType} travel обновленные данные о поездке
 * @param {string} user_id id пользователя, внесшего изменения
 * @returns {Promise<void>}
 */
export default async function saveTravel(travel, user_id){
    if(!travel){
        const error = new Error('[saveTravel] вызыввается с аргументом travel = ' + typeof travel)
        ErrorReport.sendError(error).catch(console.error)
        console.error(error)
        return
    }
    if(!user_id || typeof user_id !== 'string'){
        const error = new Error('[saveTravel] вызыввается с аргументом user_id = ' + typeof user_id)
        ErrorReport.sendError(error).catch(console.error)
        console.error(error)
        return
    }

    /***@type{TravelType}*/
    const oldTravel = await storeDB.getOne(constants.store.TRAVEL, travel.id)
    if (oldTravel){
        const newTravel = Compare.objects(oldTravel, travel, ['id']).reduce((acc, key) => {
            acc[key] = travel[key]
            return acc
        },{})

        const action = createAction(constants.store.TRAVEL, user_id, 'update', newTravel)

        await storeDB.editElement(constants.store.TRAVEL, newTravel)
        await storeDB.addElement(constants.store.TRAVEL_ACTIONS, action)
    } else {
        const action = createAction(constants.store.TRAVEL, user_id, 'add', travel)

        await storeDB.editElement(constants.store.TRAVEL, travel)
        await storeDB.addElement(constants.store.TRAVEL_ACTIONS, action)
    }
}