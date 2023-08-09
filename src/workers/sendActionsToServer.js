import aFetch from "../axios";

/**
 *
 * @param actions
 * @param {string} type
 * @returns {Promise<Response>}
 */
export default async function sendActionsToServer(actions, type) {
    let url = process.env.REACT_APP_SERVER_URL + '/actions/add/'

    if (actions && actions.length) {
        return await aFetch.post(url, actions).then(() => {
            console.log('sanded ', actions)
        })
    }
}