/**
 *
 * @param actions
 * @returns {Promise<Response>}
 */
export default async function sendActionsToServer(actions) {
    if (actions && actions.length) {
        return await fetch(process.env.REACT_APP_SERVER_URL + '/expenses/addActions/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(actions)
        })
    }


}