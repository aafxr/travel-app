import {actionsProcess} from "./actionsProcess";
import getActionsList from "./getActionsList";
import functionDurationTest from "../utils/functionDurationTest";
import constants from "../static/constants";

console.log('====worker=====')

function fetchActions(message) {
    functionDurationTest(getActionsList.bind(null, message), '[Worker] Время обработки actions: ')
}

onmessage = function (e) {
    const message = e.data
    const {type, data} = message

    console.log(message)

    if (Array.isArray(data)) {
        type === constants.store.EXPENSES_ACTIONS && actionsProcess(message)
        type === constants.store.TRAVEL_ACTIONS && actionsProcess(message)
    }
    type === 'fetch' && fetchActions(message)
}
