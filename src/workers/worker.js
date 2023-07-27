import {actionsProcess} from "./actionsProcess";
import getActionsList from "./getActionsList";
import functionDurationTest from "../utils/functionDurationTest";

console.log('====worker=====')

function fetchActions(message) {
        functionDurationTest(getActionsList.bind(null, message), '[Worker] Время обработки actions: ')
    }

onmessage = function (e) {
    const message = e.data
    const {type, data} = message

    console.log(message)

        type === 'action' && actionsProcess(data)
        type === 'fetch' && fetchActions(message)
}
