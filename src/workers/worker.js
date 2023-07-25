import toArray from "../utils/toArray";
import getActionsList from "./getActionslist";
import {offlineProcessingData} from "./offlineProcessingData";

import {actionsBlackList} from "../modules/Expenses/static/vars";
import functionDurationTest from "../utils/functionDurationTest";

console.log('====worker=====')

let getActionIntervalID

if (!getActionIntervalID) {
    getActionIntervalID = setInterval(() => {
        functionDurationTest(getActionsList, '[Worker] Время обработки actions: ')
    }, 10000)
}

onmessage = function (e) {

    const expensesActions = []
    const rest = []

    const data = toArray(JSON.parse(e.data))
    data.filter(d => !actionsBlackList.includes(d.entity) ? expensesActions.push(d) : rest.push(d))

    if (navigator.onLine) {
        if (expensesActions.length) {
            fetch(process.env.REACT_APP_SERVER_URL + '/expenses/addActions/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: JSON.stringify(expensesActions)
            })
                .then(console.log)
                .catch(console.error)
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
