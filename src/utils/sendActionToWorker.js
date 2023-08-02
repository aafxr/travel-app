import toArray from "./toArray";

/**
 * отправка action  worker-у
 * @param {Worker} worker
 * @param {string} type
 * @returns {(function(*): void)|*}
 */
export default function sendActionToWorker(worker, type) {
    return (action) => {
        const data = {
            type: 'action',
            data: toArray(action)
        }
        worker.postMessage(data)
    }
}