import storeDB from "../classes/db/storeDB/storeDB";
import constants from "../static/constants";
import ErrorReport from "../controllers/ErrorReport";
import createAction from "./createAction";

/**
 * метод удаляет информацию о путешествие из локальной БД и добавляет action
 * @function
 * @name removeTravel
 * @param {TravelStoreType} travel удаляемое путешествие
 * @param {string} user_id  id пользователя, который удалил путешествие
 * @returns {Promise<void>}
 * @category Utils
 */
export default async function removeTravel(travel, user_id){
    if(!travel){
        const error = new Error('[saveTravel] вызыввается с аргументом travel = ' + typeof travel)
        ErrorReport.sendError(error).catch(console.error)
        console.error(error)
        return
    }

    /***@type{ExpenseType[]}*/
    const expenses_actual = await storeDB.getManyFromIndex(constants.store.EXPENSES_ACTUAL, constants.indexes.PRIMARY_ENTITY_ID, travel.id)
    /***@type{ExpenseType[]}*/
    const expenses_plan = await storeDB.getManyFromIndex(constants.store.EXPENSES_PLAN, constants.indexes.PRIMARY_ENTITY_ID, travel.id)
    /***@type{LimitType[]}*/
    const limits = await storeDB.getManyFromIndex(constants.store.LIMIT, constants.indexes.PRIMARY_ENTITY_ID, travel.id)

    await Promise.all(expenses_actual.map(e => storeDB.removeElement(constants.store.EXPENSES_ACTUAL, e.id)))
    await Promise.all(expenses_plan.map(e => storeDB.removeElement(constants.store.EXPENSES_ACTUAL, e.id)))
    await Promise.all(limits.map(l => storeDB.removeElement(constants.store.EXPENSES_ACTUAL, l.id)))

    await storeDB.removeElement(constants.store.TRAVEL, travel.id)

    const action = createAction(constants.store.TRAVEL, user_id, 'remove', travel)
    await storeDB.addElement(constants.store.STORE_ACTIONS, action)

}