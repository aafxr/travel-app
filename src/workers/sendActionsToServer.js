/**
 *
 * @param actions
 * @param {string} type
 * @returns {Promise<Response>}
 */
export default async function sendActionsToServer(actions, type) {
    let url = process.env.REACT_APP_SERVER_URL + '/actions/add/'

    if (actions && actions.length) {
        return await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(actions)
        })
    }
}