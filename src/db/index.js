import {openDB} from 'idb'

/**
 * инициализация базы данных
 * @param {string} dbname                                имя создаваемой базы данных
 * @param {number} version                               версия базы дынных
 * @param {object} stores                                объект содержит name | key | indexes
 * @returns {Promise<IDBPDatabase<unknown>>}    возвращает Promise с объектом db
 */
function init({dbname, version, stores}) {
    return openDB(dbname, version, {
        upgrade(db) {
            stores.forEach(function (storeInfo) {
                if (!db.objectStoreNames.contains(storeInfo.name)) {
                    const store = db.createObjectStore(
                        storeInfo.name,
                        {autoIncrement: true}
                    );
                    storeInfo.indexes.forEach(function (indexName) {
                        store.createIndex(indexName, indexName, {});
                    })
                }
            })
        },
    })
}


export class Database {
    /**
     *  создает объект для работы с конкретной базой данных (например Expenses)
     *  @constructor
     * @param {string} dbname    имя бд
     * @param {number} version   версия бд
     * @param {object} stores    объект содержит name | key | indexes
     * @param {function} onReady вызывается если бд откылась без ошибок
     * @param {function} onError вызывается если бд откылась с ошибок
     */
    constructor({dbname, version, stores}, {onReady, onError}) {
        this.dbname = dbname;
        this.version = version;
        this.stores = stores;
        init({dbname, version, stores})
            .then((db) => {
                if (onReady) {
                    onReady(this)
                }
            })
            .catch((err) => {
                onError(err)
            })
    }

    /**
     * проверяет наличие зранилищя в бд
     * @param store       объект содержит name | key | indexes
     * @returns {storeInfo | undefined} storeInfo store | undefined
     */
    getStoreInfo(store) {
        return this.stores.find(item => item.name === store);
    }

    /**
     * проверяет существует ли index в текущем store
     * @param indexes           объект содержит name | key | indexes
     * @param {string} index    index из текущего store
     * @returns {boolean}
     */
    isIndexProp(indexes, index) {
        return indexes.includes(index);
    }

    /**
     * поиск объекта в store по переданным параметрам query
     * @param store                            объект содержит name | key | indexes
     * @param query                            параметры поиска
     * @returns {Promise<any>|Promise<never>}  возвращает Promise с резултатом поиска либо с ошибкой
     */
    getElement(store, query) {
        const storeInfo = this.getStoreInfo(store)
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then(db => {
                    if (query === 'all')
                        return db.getAll(store)
                    if (query instanceof IDBKeyRange)
                        return db.getAll(store, query)
                    return db.get(store, query)
                })
        }
        return Promise.reject(new Error(`[DB/${this.dbname}]: Store '${store}' not exist`))
    }

    /**
     * поиск объекта в store по индексу с учетом переданных параметров query
     * @param {string} store                       имя хранилища в бд
     * @param {string} indexName                   имя индекса по котрому осуществляется поиск в бд
     * @param { string | IDBKeyRange} query        параметры поиска
     * @returns {Promise<any>|Promise<never>}      Promise с результатом поиска либо ошибкой
     */
    getFromIndex(store, indexName, query) {
        const storeInfo = this.getStoreInfo(store)
        if (storeInfo) {
            if (this.isIndexProp(storeInfo.indexes, indexName)) {
                return openDB(this.dbname, this.version)
                    .then(db => {
                        if (query === 'all')
                            return db.getAllFromIndex(store, indexName)
                        if (query instanceof IDBKeyRange)
                            return db.getAllFromIndex(store, indexName, query)
                        return db.getFromIndex(store, indexName, query)
                    })
            }
            return Promise.reject(new Error(`[DB/${this.dbname}]: Index ${indexName} not exists in ${store}`))
        }
        return Promise.reject(new Error(`[DB/${this.dbname}]: Store '${store}' not exist`))
    }

    /**
     * добавляет объект в хранилище
     * @param {string} store             имя хранилища
     * @param {object} payload           данные для записи
     * @returns {Promise<never>|Promise<number | string | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[]>}   Promise с результатом добавления либо ошибкой
     */
    addElement(store, payload) {
        const storeInfo = this.getStoreInfo(store)
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then(db => {
                    return db.add(store, payload)
                })
        }
        return Promise.reject(new Error(`[DB/${this.dbname}]: Store '${store}' not exist`))
    }

    /**
     * обновляет объект в хранилище
     * @param {string} store             имя хранилища
     * @param {object} payload           данные для записи
     * @returns {Promise<never>|Promise<number | string | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[]>} Promise с результатом обовления либо ошибкой
     */
    editElement(store, payload) {
        const storeInfo = this.getStoreInfo(store)
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then(db => {
                    return db.put(store, payload)
                })
        }
        return Promise.reject(new Error(`[DB/${this.dbname}]: Store '${store}' not exist`))
    }

    /**
     * удаляет объект из хранилище
     * @param {string} store             имя хранилища
     * @param {string} key               ключ удаляемого объекта
     * @returns {Promise<never>|Promise<void>}
     */
    removeElement(store, key) {
        const storeInfo = this.getStoreInfo(store)
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then(db => {
                    if (key === 'all')
                        return db.clear()
                    return db.delete(store, key)
                })
        }
        return Promise.reject(new Error(`[DB/${this.dbname}]: Store '${store}' not exist`))
    }

}
