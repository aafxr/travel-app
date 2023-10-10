import {openDB} from 'idb';
import {pushAlertMessage} from "../components/Alerts/Alerts";
import sleep from "../utils/sleep";

/**
 * @typedef {object} StoreInfo
 * @property {string} name              имя хранилища (store) в бд
 * @property {string} [key]             (optional) (primary key) ключ по которому осуществляется поиск в store
 * @property {Array.<String>} indexes   массив индексов по которым будем искать в store
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
 * @returns {Promise<IDBPDatabase<unknown>>}             возвращает Promise с объектом db
 */
async function openDataBase(dbname, version, stores) {
    return await openDB(dbname, version, {
        upgrade(db) {
            stores.forEach(function (storeInfo) {

                if (db.objectStoreNames.contains(storeInfo.name)) {
                    db.deleteObjectStore(storeInfo.name)
                }

                const store = db.createObjectStore(storeInfo.name, {
                    keyPath: storeInfo.key,
                });

                storeInfo.indexes.forEach(function (indexName) {
                    store.createIndex(indexName, indexName, {});
                });
            });
        },
        blocked(currentVersion, blockedVersion, event) {
            // …
            pushAlertMessage({type:'danger',message: `[DB blocked] currentVersion: ${currentVersion}, blockedVersion${blockedVersion}`})
        },
        blocking(currentVersion, blockedVersion, event) {
            // …
            pushAlertMessage({type:'danger',message: `[DB blocking] currentVersion: ${currentVersion}, blockedVersion${blockedVersion}`})
        },
        terminated() {
            // …
            pushAlertMessage({type:'danger',message: `[DB terminated]`})
        },
    });
}


/**
 * @description __LocalDB__ в качестве параметров принимает схему бд (имя бд - dbname / версию / описание хранилищ),
 *
 *
 * вторым параметром принимат объект с колбэками:
 *
 * onReady вызывается когда бд создана
 *
 * onError вызывается если при создании бд возникла ошибка
 *
 *
 *
 * #### методы LocalDB:
 *
 * - addElement       ринимает имя хранилища и query => возвращает id добавленного объекта
 *
 *
 *
 * - getElement       ринимает имя хранилища и query => вернет undefined если нет объектов удовлетворяющих query
 *
 *
 *
 * - editElement      принимает имя хранилища и query => перезаписывает объекты  удовлетворяющих query
 *
 *
 *
 * - getFromIndex     принимает имя хранилища имя индекса и query => вернет undefined если нет подходящего запросу объекта
 * или обяект / массив объектов в зависимости от query
 *
 *
 *
 * если query instanceof IDBKeyRange методы описаные выше (кроме addElement) будут работать с объектами, которые подходят
 * под условия IDBKeyRange
 *
 * @class
 * @name LocalDB
 * @constructor
 * @param {string} dbname               имя бд
 * @param {number} version              версия бд
 * @param {Array.<StoreInfo>} stores    массив с инфо о всех хранилищах в бд
 * @param {function} [onReady]          вызывается если бд откылась без ошибок
 * @param {function} [onError]          вызывается если бд откылась с ошибок
 */
export class LocalDB {
    constructor({dbname, version, stores}, {onReady, onError}) {
        this.subscriptions = []
        this.dbname = dbname;
        this.version = version;
        this.stores = stores;
        this.ready = false
        this.onReady = onReady || (()=>{})
        openDataBase(dbname, version, stores)
            .then(function () {
                this.ready = true
                this.readyHandler()
            }.bind(this))
            .catch((err) => {
                onError && onError(err)
                pushAlertMessage({type:'danger', message: `Ошибка при инициализации БД\n${err.message}`})
            });
    }

    /**
     * метод вызовет callback когда бд будет инициализированна.<br/>
     * Пердотвращает обращение к бд до инициализации
     * @param {function} cb
     * @method LocalDB.onReadySubscribe
     */
    onReadySubscribe(cb){
        if (typeof cb === 'function'){
            if(this.ready){
                cb()
            }else{
                this.subscriptions.push(cb)
            }
        } else {
            console.warn("[LocalDB.onReadySubscribe] callback must be function!")
        }
    }

    /**
     * Метод вызывает все callbacks накомпленные за время инициализации бд
     * @private
     * @method LocalDB._readyHandler
     */
    _readyHandler(){
        this.onReady(this.ready)
        this.subscriptions.forEach(s => s())
        this.subscriptions = []
    }

    /**
     * Метод устанавливает callback, который будет вызван когда бд будет готова к работе
     * @method LocalDB.onReadyHandler
     * @param {function} cb
     */
    set onReadyHandler(cb){
        if (typeof cb === 'function'){
            this.onReady = cb
            this.ready && this._readyHandler()
        } else {
            console.warn("[LocalDB] onReady callback must be function!")
        }
    }

    /**
     * проверяет наличие зранилищя в бд
     * @method LocalDB.getStoreInfo
     * @param {String} storeName        имя хранилища в бд
     * @returns {StoreInfo | undefined} StoreInfo | undefined
     * @private
     */
    getStoreInfo(storeName) {
        return this.stores.find((item) => item.name === storeName);
    }

    /**
     * проверяет существует ли index в текущем store
     * @method LocalDB.isIndexProp
     * @param {Array.<String> }indexes массив с инфо о всех хранилищах в бд
     * @param {string} index           index из текущего store
     * @returns {boolean}
     * @private
     */
    isIndexProp(indexes, index) {
        return indexes.includes(index);
    }

    /**
     * поиск объекта в store по переданным параметрам query
     * @method LocalDB.getElement
     * @param {String} storeName                     массив с инфо о всех хранилищах в бд
     * @param {String | Number | IDBKeyRange} query  параметры поиска
     * @returns {Promise<any | undefined>}           возвращает Promise с резултатом поиска либо с ошибкой
     */
    async getElement(storeName, query) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            const db = await openDataBase(this.dbname, this.version, this.stores)
            if (query === 'all') {
                const res = await db.getAll(storeName)
                return Array.isArray(res) ? res : [res];
            }
            return await db.getAll(storeName, query);
        }
        console.error(`[DB/${this.dbname}]: Store '${storeInfo}' not exist`)
        return Promise.resolve();
    }

    /**
     * поиск объекта в store по переданным параметрам query
     * @method LocalDB.getOne
     * @param {String} storeName                     массив с инфо о всех хранилищах в бд
     * @param {String | Number | IDBKeyRange} query  параметры поиска
     * @returns {Promise<any | undefined>}           возвращает Promise с резултатом поиска либо с ошибкой
     */
    async getOne(storeName, query) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            const db = await openDataBase(this.dbname, this.version, this.stores)
            return await db.get(storeName, query);
        }
        console.error(`[DB/${this.dbname}]: Store '${storeInfo}' not exist`)
        return Promise.resolve();
    }

    /**
     * поиск объектов в store по переданным параметрам query
     * @method LocalDB.getMany
     * @param {String} storeName                            массив с инфо о всех хранилищах в бд
     * @param {String | Number | IDBKeyRange} query         параметры поиска
     * @returns { Promise<[]>}   возвращает Promise с резултатом поиска либо с ошибкой
     */
    async getMany(storeName, query) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            const db = await openDataBase(this.dbname, this.version, this.stores)
            return await db.getAll(storeName, query);
        }
        console.error(`[DB/${this.dbname}]: Store '${storeInfo}' not exist`)
        return Promise.resolve();
    }

    /**
     * поиск всех объектов в store
     * @method LocalDB.getAll
     * @param {String} storeName        массив с инфо о всех хранилищах в бд
     * @returns {Promise<[]>}           возвращает Promise с резултатом поиска либо с ошибкой
     */
    async getAll(storeName) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            const db = await openDataBase(this.dbname, this.version, this.stores)
            return await db.getAll(storeName);
        }
        console.error(`[DB/${this.dbname}]: Store '${storeInfo}' not exist`)
        return Promise.resolve();
    }

    /**
     * поиск объекта в store по индексу с учетом переданных параметров query
     * @method LocalDB.getFromIndex
     * @param {string} storeName                   имя хранилища в бд
     * @param {string} indexName                   имя индекса по котрому осуществляется поиск в бд
     * @param { string | IDBKeyRange} query        параметры поиска
     * @returns {Promise<any>}                     Promise с результатом поиска либо ошибкой
     */
    async getFromIndex(storeName, indexName, query) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            if (this.isIndexProp(storeInfo.indexes, indexName)) {
                const db = await openDataBase(this.dbname, this.version, this.stores)

                if (query === 'all'){
                    const res = await db.getAllFromIndex(storeName, indexName)
                    return Array.isArray(res) ? res : [res];
                }

                return await db.getAllFromIndex(storeName, indexName, query);
            }
            throw new Error(`[DB/${this.dbname}]: Index ${indexName} not exists in ${storeName}`)
        }
        throw new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
    }

    /**
     * поиск объекта в store по индексу с учетом переданных параметров query
     * @method LocalDB.getOneFromIndex
     * @param {string} storeName                   имя хранилища в бд
     * @param {string} indexName                   имя индекса по котрому осуществляется поиск в бд
     * @param { string | IDBKeyRange} query        параметры поиска
     * @returns {Promise<any>}                     Promise с результатом поиска либо ошибкой
     */
    async getOneFromIndex(storeName, indexName, query) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            if (this.isIndexProp(storeInfo.indexes, indexName)) {
                const db = await openDataBase(this.dbname, this.version, this.stores)
                return await db.getFromIndex(storeName, indexName, query);
            }
            throw new Error(`[DB/${this.dbname}]: Index ${indexName} not exists in ${storeName}`)
        }
        throw new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
    }


    /**
     * поиск объекта в store по индексу с учетом переданных параметров query
     * @method LocalDB.getManyFromIndex
     * @param {string} storeName                   имя хранилища в бд
     * @param {string} indexName                   имя индекса по котрому осуществляется поиск в бд
     * @param { string | IDBKeyRange} query        параметры поиска
     * @returns {Promise<[]>}                     Promise с результатом поиска либо ошибкой
     */
    async getManyFromIndex(storeName, indexName, query) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            if (this.isIndexProp(storeInfo.indexes, indexName)) {
                const db = await openDataBase(this.dbname, this.version, this.stores)
                return await db.getAllFromIndex(storeName, indexName, query);
            }
            throw new Error(`[DB/${this.dbname}]: Index ${indexName} not exists in ${storeName}`)
        }
        throw new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
    }

    /**
     * поиск объекта в store по индексу с учетом переданных параметров query
     * @method LocalDB.getAllFromIndex
     * @param {string} storeName                   имя хранилища в бд
     * @param {string} indexName                   имя индекса по котрому осуществляется поиск в бд
     * @returns {Promise<any>}                     Promise с результатом поиска либо ошибкой
     */
    async getAllFromIndex(storeName, indexName) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            if (this.isIndexProp(storeInfo.indexes, indexName)) {
                const db = await openDataBase(this.dbname, this.version, this.stores)
                return await db.getFromIndex(storeName, indexName);
            }
            throw new Error(`[DB/${this.dbname}]: Index ${indexName} not exists in ${storeName}`)
        }
        throw new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
    }

    /**
     * добавляет объект в хранилище
     * @method LocalDB.addElement
     * @param {string} storeName         имя хранилища
     * @param {object} payload           данные для записи
     * @returns {Promise<never>|Promise<number | string | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[]>}   Promise с результатом добавления либо ошибкой
     */
    async addElement(storeName, payload) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            const db = await openDataBase(this.dbname, this.version, this.stores)
            return await db.add(storeName, payload);
        }
        throw new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
    }

    /**
     * обновляет объект в хранилище
     * @method LocalDB.editElement
     * @param {string} storeName         имя хранилища
     * @param {object} payload           данные для записи
     * @returns {Promise<never>|Promise<number | string | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[]>} Promise с результатом обовления либо ошибкой
     */
    async editElement(storeName, payload) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            const db = await openDataBase(this.dbname, this.version, this.stores)
            return await db.put(storeName, payload);
        }
        throw new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
    }

    /**
     * удаляет объект из хранилище
     * @method LocalDB.removeElement
     * @param {string} storeName         имя хранилища
     * @param {string} key               ключ удаляемого объекта
     * @returns {Promise<void>}
     */
    async removeElement(storeName, key) {
        while (!this.ready) await sleep(300)

        const storeInfo = this.getStoreInfo(storeName);
        if (storeInfo) {
            const db = await openDataBase(this.dbname, this.version, this.stores)
            if (key === 'all') {
                return await db.clear(storeName);
            }
            return await db.delete(storeName, key);
        }
        throw new Error(`[DB/${this.dbname}]: Store '${storeName}' not exist`)
    }
}
