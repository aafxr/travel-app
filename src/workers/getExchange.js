import constants from "../static/constants";

/**
 * @param {IDBTransaction} transaction
 * @param {string | number} date
 * @returns {Promise<ExchangeType | null>}
 */
export default function getExchange(transaction, date) {
    return new Promise(res => {
        const key = new Date(date).getTime()
        const store = transaction.objectStore(constants.store.CURRENCY)

        const req = store.get(IDBKeyRange.upperBound(key))
        req.onerror = () => res(null)
        req.onsuccess = () => {
            const ex = req.result
            if (ex) {
                res(ex)
            } else {
                res(null)
            }
        }
    })
}