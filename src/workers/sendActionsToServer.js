/**
 *
 * @param actions
 * @param {string} type
 * @returns {Promise<Response>}
 */
export default async function sendActionsToServer(actions, type) {
    let url
    let data

    if(type === 'expensesActions'){
        url = process.env.REACT_APP_SERVER_URL + '/expenses/addActions/'
        data = actions
    } else if (type === 'travelsActions'){
        url = process.env.REACT_APP_SERVER_URL + '/travel/add/'
        data = actions.map(a => a.data)
    } else {
        console.log({actions, type})
        return
    }



    if (actions && actions.length) {
        return await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
    }
}