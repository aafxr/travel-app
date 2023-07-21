import constants from "../modules/Expenses/db/constants";
import {actionsBlackList} from "../modules/Expenses/static/vars";

console.log('====worker=====')

setTimeout(async () => {
    const response = await fetch (process.env.REACT_APP_SERVER_URL + '/expenses/getActions/')
    const expensesActions = await response.json()



    console.log('worker receive ', expensesActions)
    if(expensesActions.ok && expensesActions.result){
        postMessage(expensesActions.result)
    }

}, 2000)



onmessage = function (e) {

    const data = JSON.parse(e.data)
    if(data && Array.isArray(data)){
        const expensesActions = []
        const rest = []

        data.filter(d => !actionsBlackList.includes(d.entity) ? expensesActions.push(d) : rest.push(d) )

        if (expensesActions.length && process.env.NODE_ENV === 'production') {
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