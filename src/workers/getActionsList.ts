import {ActionType} from "../types/ActionsType";
import {Action} from "../classes/StoreEntities";
import {StoreName} from "../types/StoreName";
import {IndexName} from "../types/IndexName";
import {DB} from "../classes/db/DB";


// let ready = false
// const db = new LocalDB(schema, {
//     onReady: () => ready = true,
//     onError: e => console.error(e)
// })

// const actionsModel = new Model(db, constants.store.EXPENSES_ACTIONS, actionsValidation)


type ResponseType = {
    ok: boolean,
    result: ActionType[]
}

/**
 * функуия запрашивает список actions
 * @returns {Promise<void>}
 */
export default async function getActionsList(message: any) {
    const {filter} = message
    const response = await fetch(process.env.REACT_APP_SERVER_URL + '/expenses/getActions/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({filter})
    })
    const receivedActions: ResponseType = await response.json()
    console.log('Received data: ', receivedActions)


    if (receivedActions.ok && receivedActions.result) {
        receivedActions.result.forEach(a => a.synced ? 1 : 0)

        DB.getAllFromIndex<Action<any>>(StoreName.ACTION, IndexName.SYNCED, undefined)
            .then((actions) => {
                const existingActions = actions.reduce<{[key:string]:Action<any>}>((acc, a) => {
                    acc[a.id] = a
                    return acc
                }, {})
                const filtered = receivedActions.result.filter(a => !existingActions[a.id])
                postMessage({type: 'action', data: filtered})
            })
    }

}