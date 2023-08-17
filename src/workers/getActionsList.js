import {LocalDB} from "../db/LocalDB";
import Model from "../models/Model";
import schema from "../db/expensesDB/schema";
import constants from "../static/constants";
import actionsValidation from "../models/action/validation";
import functionDurationTest from "../utils/functionDurationTest";


let ready = false
const db = new LocalDB(schema, {
    onReady: () => ready = true,
    onError: e => console.error(e)
})

const actionsModel = new Model(db, constants.store.EXPENSES_ACTIONS, actionsValidation)


/**
 * функуия запрашивает список actions
 * @returns {Promise<void>}
 */
export default async function getActionsList(message) {
    const {filter} = message
    if (ready) {
        const response = await fetch(process.env.REACT_APP_SERVER_URL + '/expenses/getActions/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({filter})
        })
        const receivedActions = await response.json()
        console.log('Received data: ', receivedActions)


        if (receivedActions.ok && receivedActions.result) {
            receivedActions.result.forEach(a => a.synced ? 1 : 0)
            functionDurationTest(async () => {
                const actions = await actionsModel.getFromIndex(constants.indexes.SYNCED, 1)
                const existingActions = actions.reduce((acc, a) => {
                    acc[a.uid] = a
                    return acc
                }, {})
                const filtered = receivedActions.result.filter(a => !existingActions[a.uid])
                postMessage({type: 'action', data: filtered})
            }, '[Worker] без fetch: ')
        }

    }
}