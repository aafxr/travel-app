import getFilteredActions from "./getFilteredActions";
import sendActionsToServer from "./sendActionsToServer";

let queue = []
let intervalId = null


/**
 * отправка actions на север. Если Оффлайн записывает actions и очередь и запускает setInterval.
 * После востановления соединения, отправляет накопившуюся очередь на сервер
 * @param {Array} actions
 * @param {string} type
 */
export function actionsProcess({data: actions, type}) {
    const [whiteList, blackList] = getFilteredActions(actions)

    if (navigator.onLine) {
        sendActionsToServer(whiteList, type)
            .catch(console.error)
    } else {
        queue = queue.concat(actions)
        if (!intervalId) {
            intervalId = setInterval(waitForOnline, 5000)
        }
        queue = queue.concat(whiteList)
    }

    if (blackList.length){
        blackList.forEach(a => a.synced = 1)
        postMessage({
            type: 'action',
            data: blackList
        })

    }

}


function waitForOnline() {
    console.log('user offline, data to send: ', queue)
    if (navigator.onLine) {
        clearInterval(intervalId)
        intervalId = null
        sendActionsToServer(queue)
            .then(() => queue = [])
            .catch(console.error)
    }
}
