import {openDB} from 'idb';

/**
 * @typedef {object} StoreInfo
 * @property {string} name имя хранилища (store) в бд
 * @property {string} [key] (optional) (primary key) ключ по которому осуществляется поиск в store
 * @property {Array.<String>} indexes массив индексов по которым будем искать в store
 */

/**
 * @typedef {object} DBSchemaType
 * @property {string} dbname
 * @property {number} version
 * @property {Array.<StoreInfo>} stores
 */

/**
 * инициализация базы данных
 * @param {string} dbname                                имя создаваемой базы данных
 * @param {number} version                               версия базы дынных
 * @param {Array.<StoreInfo>} stores                     массив с инфо о всех хранилищах в бд
 * @returns {Promise<IDBPDatabase<unknown>>}    возвращает Promise с объектом db
 */
function init({dbname, version, stores}) {
    return openDB(dbname, version, {
        upgrade(db) {
            stores.forEach(function (storeInfo) {
                if (!db.objectStoreNames.contains(storeInfo.name)) {
                    const store = db.createObjectStore(storeInfo.name, {
                        keyPath: storeInfo.key,
                        autoIncrement: true,
                    });
                    storeInfo.indexes.forEach(function (indexName) {
                        store.createIndex(indexName, indexName, {});
                    });
                }
            });
        },
    });
}

export class LocalDB {
    /**
     *  создает объект для работы с конкретной базой данных (например Expenses)
     *  @constructor
     * @param {string} dbname    имя бд
     * @param {number} version   версия бд
     * @param {Array.<StoreInfo>} stores массив с инфо о всех хранилищах в бд
     * @param {function} [onReady] вызывается если бд откылась без ошибок
     * @param {function} [onError] вызывается если бд откылась с ошибок
     */
    constructor({dbname, version, stores}, {onReady, onError}) {
        this.dbname = dbname;
        this.version = version;
        this.stores = stores;
        init({dbname, version, stores})
            .then((db) => {
                onReady && onReady(this);
            })
            .catch((err) => {
                onError && onError(err);
            });
    }

    /**
     * проверяет наличие зранилищя в бд
     * @param {String} storeName        имя хранилища в бд
     * @returns {StoreInfo | undefined} StoreInfo | undefined
     */
    getStoreInfo(storeName) {
        return this.stores.find((item) => item.name === storeName);
    }

    /**
     * проверяет существует ли index в текущем store
     * @param {Array.<String> }indexes массив с инфо о всех хранилищах в бд
     * @param {string} index           index из текущего store
     * @returns {boolean}
     */
    isIndexProp(indexes, index) {
        return indexes.includes(index);
    }

    /**
     * поиск объекта в store по переданным параметрам query
     * @param {String} storeName                     массив с инфо о всех хранилищах в бд
     * @param {String | Number | IDBKeyRange} query параметры поиска
     * @returns {Promise<any | undefined>}       возвращает Promise с резултатом поиска либо с ошибкой
     */
    async getElement(storeName, query) {
        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            const db = await openDB(this.dbname, this.version)
            if (query === 'all') {
                return await db.getAll(storeName);
            }
            return await db.get(storeName, query);
        }
        console.error(`[DB/${this.dbname}]: Store '${storeInfo}' not exist`)
        return Promise.resolve();
    }

    /**
     * поиск объекта в store по индексу с учетом переданных параметров query
     * @param {string} storeName                   имя хранилища в бд
     * @param {string} indexName                   имя индекса по котрому осуществляется поиск в бд
     * @param { string | IDBKeyRange} query        параметры поиска
     * @returns {Promise<any>}      Promise с результатом поиска либо ошибкой
     */
    getFromIndex(storeName, indexName, query) {
        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            if (this.isIndexProp(storeInfo.indexes, indexName)) {
                return openDB(this.dbname, this.version)
                    .then((db) => {
                        if (query === 'all')
                            return db.getAllFromIndex(storeName, indexName);
                        if (query instanceof IDBKeyRange)
                            return db.getAllFromIndex(storeName, indexName, query);
                        return db.getFromIndex(storeName, indexName, query);
                    });
            }
            return Promise.reject(
                new Error(
                    `[DB/${this.dbname}]: Index ${indexName} not exists in ${storeName}`
                )
            );
        }
        return Promise.reject(
            new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
        );
    }

    /**
     * добавляет объект в хранилище
     * @param {string} storeName         имя хранилища
     * @param {object} payload           данные для записи
     * @returns {Promise<never>|Promise<number | string | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[]>}   Promise с результатом добавления либо ошибкой
     */
    addElement(storeName, payload) {
        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then((db) => {
                    return db.add(storeName, payload);
                })
        }
        return Promise.reject(
            new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
        );
    }

    /**
     * обновляет объект в хранилище
     * @param {string} storeName         имя хранилища
     * @param {object} payload           данные для записи
     * @returns {Promise<never>|Promise<number | string | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[]>} Promise с результатом обовления либо ошибкой
     */
    editElement(storeName, payload) {
        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then((db) => {
                    return db.put(storeName, payload);
                });
        }
        return Promise.reject(
            new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
        );
    }

    /**
     * удаляет объект из хранилище
     * @param {string} storeName         имя хранилища
     * @param {string} key               ключ удаляемого объекта
     * @returns {Promise<never>|Promise<void>}
     */
    removeElement(storeName, key) {
        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then((db) => {
                    if (key === 'all') return db.clear(storeName);
                    return db.delete(storeName, key);
                });
        }
        return Promise.reject(
            new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
        );
    }
}
