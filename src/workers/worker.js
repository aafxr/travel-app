import {actionsProcess} from "./actionsProcess";
import getActionsList from "./getActionsList";
import functionDurationTest from "../utils/functionDurationTest";
import constants from "../static/constants";
import expensesDB from "../db/expensesDB/expensesDB";
import aFetch from "../axios";
import travelDB from "../db/travelDB/travelDB";
import distinctValues from "../utils/distinctValues";
import storeDB from "../db/storeDB/storeDB";

console.log('====worker=====')

function fetchActions(message) {
    functionDurationTest(getActionsList.bind(null, message), '[Worker] Время обработки actions: ')
}

onmessage = function (e) {
    const message = e.data
    const {type, data} = message

    console.log(message)

    if (Array.isArray(data)) {
        type === 'action' && actionsProcess(message)
    }
    type === 'fetch' && fetchActions(message)
}


if (process.env.NODE_ENV === 'production') {
    //=================================== проверка и попытка отправить Expenses Actions ====================================
    setInterval(async () => {
        try {
            const actions = await expensesDB.getManyFromIndex(constants.store.EXPENSES_ACTIONS, constants.indexes.SYNCED, 0)
            if (actions && actions.length) {
                const response = await aFetch.post('/actions/add/', actions)
                console.log(response.data)
                const {ok, result} = response.data

                if (ok) {
                    const sendedActions = actions.filter(a => result[a.id] && result[a.id].ok)
                        .map(a => {
                            a.synced = 1
                            return a
                        })
                    await Promise.all(sendedActions.map(a => expensesDB.editElement(constants.store.EXPENSES_ACTIONS, a)))
                        .then(() => actionsUpdatedNotification(sendedActions))
                }
            }
        } catch (err) {
            console.error(err)
        }
    }, 4000)


//=================================== проверка и попытка отправить Travels Actions =====================================
    setInterval(async () => {
        try {
            const actions = await travelDB.getManyFromIndex(constants.store.TRAVEL_ACTIONS, constants.indexes.SYNCED, 0)
            if (actions && actions.length) {
                const response = await aFetch.post('/actions/add/', actions)
                console.log(response.data)
                const {ok, result} = response.data

                if (ok) {
                    const sendedActions = actions.filter(a => result[a.id] && result[a.id].ok)
                        .map(a => {
                            a.synced = 1
                            return a
                        })
                    await Promise.all(sendedActions.map(a => travelDB.editElement(constants.store.TRAVEL_ACTIONS, a)))
                        .then(() => actionsUpdatedNotification(sendedActions))
                }
            }
        } catch (err) {
            console.error(err)
        }

    }, 10000)
}

//=================================== проверка и попытка отправить Travels Actions =====================================
setInterval(async () => {
    try {
        const actions = await storeDB.getManyFromIndex(constants.store.STORE_ACTIONS, constants.indexes.SYNCED, 0)
        if (actions && actions.length) {
            const response = await aFetch.post('/actions/add/', actions)
            console.log(response.data)
            const {ok, result} = response.data

            if (ok) {
                const sendedActions = actions.filter(a => result[a.id] && result[a.id].ok)
                    .map(a => {
                        a.synced = 1
                        return a
                    })
                await Promise.all(sendedActions.map(a => travelDB.editElement(constants.store.STORE_ACTIONS, a)))
                    .then(() => actionsUpdatedNotification(sendedActions))
            }
        }
    } catch (err) {
        console.error(err)
    }

}, 8000)



//================================== Отправка уведомления об обновлении actions ========================================
function actionsUpdatedNotification(actions) {
    const entity = distinctValues(actions, a => a.entity)
    entity.forEach(e =>
        postMessage({type: e})
    )
}
