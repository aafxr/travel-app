import {LocalDB} from "../db";
import Model from "../models/Model";
import schema from "../modules/Expenses/db/schema";
import constants from "../modules/Expenses/db/constants";
import actionsValidation from "../modules/Expenses/models/action/validation";
import functionDurationTest from "../utils/functionDurationTest";


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
export default async function getActionsList(travelCode) {
    if (ready) {
        const response = await fetch(process.env.REACT_APP_SERVER_URL + '/expenses/getActions/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({filter: {entity: travelCode || 'travel'}})
        })
        const receivedActions = await response.json()
        console.log('Received data: ', receivedActions)


        if (receivedActions.ok && receivedActions.result) {
            functionDurationTest(async () => {
                const actions = await actionsModel.getFromIndex(constants.indexes.SYNCED, 1)
                const existingActions = actions.reduce((acc, a) => {
                    acc[a.uid] = a
                    return acc
                }, {})
                const filtered = receivedActions.result.filter(a => !existingActions[a.uid])
                postMessage(filtered)
            }, '[Worker] без fetch: ')
        }

    }
}