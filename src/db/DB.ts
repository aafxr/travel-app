import {IDBPDatabase, openDB} from "idb";

import {DBStoreDescriptionType} from "../types/DBStoreDescriptionType";
import {Action, StorageEntity, User} from "../classes/StoreEntities";
import {DB_NAME, DB_STORES, DB_VERSION} from "./db-constants";
import {pushAlertMessage} from "../components/Alerts/Alerts";
import {ActionName} from "../types/ActionsType";
import {StoreName} from "../types/StoreName";

async function openDataBase(dbname: string = DB_NAME, version = DB_VERSION, stores: DBStoreDescriptionType[] = DB_STORES) {
    return await openDB(dbname, version, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            Array.from(db.objectStoreNames).forEach(storeName => db.deleteObjectStore(storeName))

            const existedStores = Array.from(db.objectStoreNames)
            const storeNameList = stores.map(store => '' + store.name)

            /*** удаление существующих store из indexeddb если их нет в списке storeInfo (т.е. нет в схеме бд) */
            existedStores
                .filter(store => !storeNameList.includes(store))
                .forEach(store => db.deleteObjectStore(store))

            stores.forEach((storeInfo) => {
                /*** проверяем существует ли в бд таблица с именем storeInfo.name */
                if (!db.objectStoreNames.contains(storeInfo.name)) {

                    const store =
                        db.createObjectStore(storeInfo.name, {keyPath: storeInfo.key,});

                    storeInfo.indexes.forEach(
                        (indexName) => {
                            store.createIndex(indexName, indexName, {});
                        });

                    /*** если store существует обновляем индексы для этого store */
                } else {
                    const store = transaction.objectStore(storeInfo.name)
                    const indexs = store.indexNames
                    const newIndexes = storeInfo.indexes.map(index => '' + index)

                    newIndexes.forEach(index => {
                        if (!indexs.contains(index)) store.createIndex(index, index, {})
                    })
                    Array
                        .from(indexs)
                        .filter(index => !newIndexes.includes(index))
                        .forEach(index => store.deleteIndex(index))
                }
            });
        },
        blocked(currentVersion, blockedVersion, event) {
            // …
            pushAlertMessage({
                type: 'danger',
                message: `[DB blocked] currentVersion: ${currentVersion}, blockedVersion${blockedVersion}`
            })
        },
        blocking(currentVersion, blockedVersion, event) {
            // …
            pushAlertMessage({
                type: 'danger',
                message: `[DB blocking] currentVersion: ${currentVersion}, blockedVersion${blockedVersion}`
            })
        },
        terminated() {
            // …
            pushAlertMessage({type: 'danger', message: `[DB terminated]`})
        },
    });
}


const startTransaction = <T extends StorageEntity>(data: T, db: IDBPDatabase) => db.transaction([data.storeName, StoreName.ACTION], "readwrite")


export class DB {
    static add<T extends StorageEntity>(data: T, user: User, success: Function, error?: (e: Error) => void): void {
        openDataBase()
            .then(db => {
                const tx = startTransaction(data, db)
                const actionStore = tx.objectStore(StoreName.ACTION)
                const elementStore = tx.objectStore(data.storeName)

                elementStore.add(data.dto())

                if (data.withAction) {
                    const action = new Action(data, user.id, data.storeName, ActionName.ADD)
                    actionStore.add(action.dto())
                }

            })
            .then(() => success && success())
            .catch(e => error && error(e))
    }

    static getOne<T extends StorageEntity>(storeName: StoreName, id: IDBValidKey, success?: (data: T | undefined) => void, error?: (e: Error) => void): void {
        openDataBase()
            .then(async (db) => {
                const tx = db.transaction(storeName)
                const store = tx.objectStore(storeName)
                return await store.get(id)
            })
            .then((item) => success && success(item))
            .catch(e => error && error(e))
    }

    static getMany<T extends StorageEntity>(storeName: StoreName, range: IDBKeyRange, success?: (data: T[]) => void, error?: (e: Error) => void): void {
        openDataBase()
            .then(async (db) => {
                const tx = db.transaction(storeName)
                const store = tx.objectStore(storeName)
                return await store.getAll(range)
            })
            .then((items) => success && success(items))
            .catch(e => error && error(e))
    }

    static getAll<T extends StorageEntity>(storeName: StoreName, success?: (data: T[]) => void, error?: (e: Error) => void): void {
        openDataBase()
            .then(async (db) => {
                const tx = db.transaction(storeName)
                const store = tx.objectStore(storeName)
                return await store.getAll()
            })
            .then((items) => success && success(items))
            .catch(e => error && error(e))
    }

    static getOneFromIndex<T extends StorageEntity>(storeName: StoreName, index: keyof T, query: IDBValidKey, success?: (data: T | undefined) => void, error?: (e: Error) => void): void {
        openDataBase()
            .then(async (db) => {
                const tx = db.transaction(storeName)
                const store = tx.objectStore(storeName)
                const idx = store.index(index as string)
                return await idx.get(query)
            })
            .then((item) => success && success(item))
            .catch(e => error && error(e))
    }

    static getManyFromIndex<T extends StorageEntity>(storeName: StoreName, index: keyof T, query: IDBKeyRange, success?: (data: T[]) => void, error?: (e: Error) => void): void {
        openDataBase()
            .then(async (db) => {
                const tx = db.transaction(storeName)
                const store = tx.objectStore(storeName)
                const idx = store.index(index as string)
                return await idx.getAll(query)
            })
            .then((items) => success && success(items))
            .catch(e => error && error(e))
    }

    static getAllFromIndex<T extends StorageEntity>(storeName: StoreName, index: keyof T, count?: number, success?: (data: T[]) => void, error?: (e: Error) => void): void {
        openDataBase()
            .then(async (db) => {
                const tx = db.transaction(storeName)
                const store = tx.objectStore(storeName)
                const idx = store.index(index as string)
                return await idx.getAll()
            })
            .then((items) => success && success(items))
            .catch(e => error && error(e))
    }

    static update<T extends StorageEntity>(data: T, user: User, success?: Function, error?: (e: Error) => void): void {
        openDataBase()
            .then(db => {
                const tx = startTransaction(data, db)
                const actionStore = tx.objectStore(StoreName.ACTION)
                const elementStore = tx.objectStore(data.storeName)

                elementStore.put(data.dto())

                if (data.withAction) {
                    const action = new Action(data, user.id, data.storeName, ActionName.UPDATE)
                    actionStore.add(action.dto())
                }

            })
            .then(() => success && success())
            .catch(e => error && error(e))
    }

    static delete<T extends StorageEntity>(data: T, user: User, success?: Function, error?: (e: Error) => void): void {
        openDataBase()
            .then(db => {
                const tx = startTransaction(data, db)
                const actionStore = tx.objectStore(StoreName.ACTION)
                const elementStore = tx.objectStore(data.storeName)


                elementStore.delete(data.dto().id)

                if (data.withAction) {
                    const action = new Action(data, user.id, data.storeName, ActionName.DELETE)
                    actionStore.add(action.dto())
                }

            })
            .then(() => success && success())
            .catch(e => error && error(e))
    }

}