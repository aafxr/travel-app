import constants from "../modules/Expenses/db/constants";

console.log('====worker=====')

setTimeout(async () => {
    const response = await fetch (process.env.REACT_APP_SERVER_URL + '/expenses/getActions/')
    const expensesActions = await response.json()

    console.log('worker receive ', expensesActions)
    if(expensesActions.ok && expensesActions.result){
        postMessage(expensesActions.result)
    }

}, 2000)


const actionsBlackList = [constants.store.SECTION, constants.store.LIMIT]
onmessage = function (e) {

    const data = JSON.parse(e.data)
    if(data && Array.isArray(data)){
        const expensesActions = []
        const rest = []

        data.filter(d => !actionsBlackList.includes(d.entity) ? expensesActions.push(d) : rest.push(d) )

        if (expensesActions.length ) {
            console.log('=========отправка на сервер=========')
            console.log(expensesActions)
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
                } )
                .forEach(d => postMessage(d) )

        }


    }else{
        console.warn(data)
    }

}