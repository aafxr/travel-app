import {actionsBlackList} from "../modules/Expenses/static/vars";

console.log('====worker=====')

const queue = []


setInterval(async () => {
    const response = await fetch(process.env.REACT_APP_SERVER_URL + '/expenses/getActions/')
    const expensesActions = await response.json()


    console.log('worker receive ', expensesActions)
    if (expensesActions.ok && expensesActions.result) {
        postMessage(expensesActions.result)
    }

}, 5000)


onmessage = function (e) {

    const data = JSON.parse(e.data)
    if (data && Array.isArray(data)) {
        const expensesActions = []
        const rest = []

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
            queue.concat(expensesActions)
            queue.concat(rest)


            const intervalId = setInterval(() => {
                if (navigator.onLine) {
                    clearInterval(intervalId)
                    fetch(process.env.REACT_APP_SERVER_URL + '/expenses/addActions/', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json;charset=utf-8"
                        },
                        body: JSON.stringify(queue)
                    })
                        .then(() => queue.splice(0, queue.length))
                        .catch(console.error)
                }
            }, 5000)
        }


    } else {
        console.warn(data)
    }

}