let queue = []
let intervalId = null

export function offlineProcessingData(expensesActions, rest) {
    queue = queue.concat(expensesActions)
    queue = queue.concat(rest)

    if (!intervalId) {
        intervalId = setInterval(() => {
            console.log('user offline, data to send: ', queue)
            if (navigator.onLine) {
                clearInterval(intervalId)
                intervalId = null
                fetch(process.env.REACT_APP_SERVER_URL + '/expenses/addActions/', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    body: JSON.stringify(queue)
                })
                    .then(() => queue = [])
                    .catch(console.error)
            }
        }, 5000)
    }
}
