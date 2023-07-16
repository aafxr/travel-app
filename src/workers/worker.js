import constants from "../modules/Expenses/db/constants";


const actionsBlackList = [constants.store.SECTION, constants.store.LIMIT]
onmessage = function (e) {

    const data = JSON.parse(e.data)

    if (!actionsBlackList.includes(data.entity) && process.env.NODE_ENV === 'production') {
        console.log('=========отправка на сервер=========')
        console.log(data)
        fetch(process.env.REACT_APP_SERVER_URL + '/expenses/addActions/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: e.data
        })
            .then(console.log)
            .catch(console.error)
    }

    data.synced = 1
    postMessage(data)
}