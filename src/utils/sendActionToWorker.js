import toArray from "./toArray";

/**
 * отправка action  worker-у
 * @param {Worker} worker
 * @returns {(function(*): void)|*}
 */
export default function sendActionToWorker(worker) {
    return (action) => {
        const data = {
            type: 'action',
            data: toArray(action)
        }
        worker.postMessage(data)
    }
}