import toArray from "../utils/toArray";
import getActionsList from "./getActionslist";
import {offlineProcessingData} from "./offlineProcessingData";

import {actionsBlackList} from "../modules/Expenses/static/vars";
import functionDurationTest from "../utils/functionDurationTest";
import sendActions from "./sendActions";

console.log('====worker=====')

// let actionsModel
// let dbReady = false

// new LocalDB(schema,{
//     onReady(db){
//         // actionsModel = new Model(db, constants.store.ACTIONS, actionsValidation)
//         // dbReady = true
//     },
//     onError(err){
//         console.error(err)
//         ErrorReport.sendReport(err).catch(console.error)
//     }
// })


let getActionIntervalID

if (!getActionIntervalID) {
    getActionIntervalID = setInterval(() => {
        functionDurationTest(getActionsList, '[Worker] Время обработки actions: ')
    }, 5000)
}

onmessage = function (e) {

    const data = JSON.parse(e.data)
    console.log('================',data)
    if (data.type === 'action' && data.action) {

        const expensesActions = []
        const rest = []


        data.action.data.filter(d => !actionsBlackList.includes(d.entity) ? expensesActions.push(d) : rest.push(d))

        if (navigator.onLine) {
            if (expensesActions.length) {
                sendActions(expensesActions)
            }

            if (rest.length) {
                rest
                    .map(d => {
                        d.synced = 1
                        return d
                    })
                postMessage(rest)

            }
        } else {
            offlineProcessingData(expensesActions, rest)
        }
    }
}
