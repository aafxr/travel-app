import {LocalDB} from "../db";
import Model from "../models/Model";
import schema from "../modules/Expenses/db/schema";
import constants from "../modules/Expenses/db/constants";
import actionsValidation from "../modules/Expenses/models/action/validation";


let ready = false
const db = new LocalDB(schema, {
    onReady: () => ready = true,
    onError: e => console.error(e)
})

const actionsModel = new Model(db, constants.store.ACTIONS, actionsValidation)


/**
 * функуия запрашивает список actions
 * @returns {Promise<void>}
 */
export default async function getActionsList() {
    if (ready) {
        const response = await fetch(process.env.REACT_APP_SERVER_URL + '/expenses/getActions/')
        const receivedActions = await response.json()
        console.log('Received data: ',receivedActions)

        if (receivedActions.ok && receivedActions.result) {
            const actions = await actionsModel.getFromIndex(constants.indexes.SYNCED, 1)
            const existingActions = actions.reduce((acc, a) => {
                acc[a.uid] = a
                return acc
            }, {})
            const filtered = receivedActions.result.filter(a => !existingActions[a.uid])
            postMessage(filtered)
        }
    }
}