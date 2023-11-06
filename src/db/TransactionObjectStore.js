export default class TransactionObjectStore {
    /**
     * @param {IDBObjectStore} objectStore
     */
    constructor(objectStore) {
        this._store = objectStore
    }

    /**
     * @method
     * @name TransactionObjectStore.add
     * @param item
     * @returns {Promise<unknown>}
     */
    add(item) {
        return new Promise((res, rej) => {
            /**@type{IDBRequest<IDBValidKey>}*/
            const req = this._store.add(item)
            req.onerror = rej
            req.onsuccess = () => res(req.result)

        })
    }

    /**
     * @method
     * @name TransactionObjectStore.get
     * @param {IDBValidKey} query
     * @returns {Promise<unknown>}
     */
    get(query) {
        return new Promise((res, rej) => {
            /**@type{IDBRequest<IDBValidKey>}*/
            const req = this._store.get(query)
            req.onerror = rej
            req.onsuccess = () => res(req.result)
        })
    }

    /**
     * @method
     * @name TransactionObjectStore.put
     * @param item
     * @returns {Promise<unknown>}
     */
    put(item) {
        return new Promise((res, rej) => {
            /**@type{IDBRequest<IDBValidKey>}*/
            const req = this._store.put(item)
            req.onerror = rej
            req.onsuccess = () => res(req.result)
        })
    }

    /**
     * @method
     * @name TransactionObjectStore.delete
     * @param {IDBValidKey} query
     * @returns {Promise<unknown>}
     */
    delete(query) {
        return new Promise((res, rej) => {
            /**@type{IDBRequest<IDBValidKey>}*/
            const req = this._store.delete(query)
            req.onerror = rej
            req.onsuccess = () => res(req.result)
        })
    }

    /**
     * @method
     * @name TransactionObjectStore.openCursor
     * @param {IDBValidKey | IDBKeyRange} query
     * @param {IDBCursorDirection} [direction]
     * @returns {Promise<Pick<IDBCursorWithValue, 'key'|'value'|'continue'>>}
     */
    openCursor(query, direction) {
        return new Promise((res, rej) => {
            /**@type{IDBRequest<IDBCursorWithValue>}*/
            const req = this._store.openCursor(query, direction)
            req.onerror = rej
            req.onsuccess = () => {
                const c = req.result
                if(c){
                    const tempCursor = {
                        key: c.key,
                        value: c.value,
                        /**
                         * @returns {Promise<Pick<IDBCursorWithValue, 'key'|'value'|'continue'>>}
                         */
                        continue() {
                            return new Promise((res) => {
                                req.onsuccess = () => {
                                    const c = req.result
                                    if (c) {
                                        this.key = c.key
                                        this.value = c.value
                                        res(this)
                                    } else {
                                        res(null)
                                    }
                                }
                            })
                        }
                    }

                    tempCursor.continue.bind(tempCursor)
                    res(tempCursor)
                }else{
                    res(null)
                }
            }
        })

    }

    /**
     * @method
     * @name TransactionObjectStore.openIndexCursor
     * @param {string} indexName
     * @param {IDBValidKey | IDBKeyRange} query
     * @param {IDBCursorDirection} [direction]
     * @returns {Promise<Pick<IDBCursorWithValue, 'key'|'value'|'continue'>>}
     */
    openIndexCursor(indexName, query, direction ) {
        const req = this._store.index(indexName).openCursor(query)

        return new Promise((res, rej) => {
            /**@type{IDBRequest<IDBCursorWithValue>}*/
            const req = this._store.openCursor(query, direction)
            req.onerror = rej
            req.onsuccess = () => {
                const c = req.result

                if(c) {
                    const tempCursor = {
                        key: c.key,
                        value: c.value,
                        /**
                         * @returns {Promise<Pick<IDBCursorWithValue, 'key'|'value'|'continue'>>}
                         */
                        continue() {
                            return new Promise((res) => {
                                req.onsuccess = () => {
                                    const c = req.result
                                    if (c) {
                                        this.key = c.key
                                        this.value = c.value
                                        res(this)
                                    } else {
                                        res(null)
                                    }
                                }
                            })
                        },
                    }

                    tempCursor.continue.bind(tempCursor)
                    res(tempCursor)
                }else{
                    res(null)
                }
            }
        })

    }

}