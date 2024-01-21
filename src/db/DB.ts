import {openDB} from "idb";
import {pushAlertMessage} from "../components/Alerts/Alerts";
import {DB_NAME, DB_VERSION} from "./db-constants";

async function openDataBase(dbname:string = DB_NAME, version = DB_VERSION, stores) {
    return await openDB(dbname, version, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            console.log('upgrade db')
            const existedStores = Array.from(db.objectStoreNames)
            const storeNameList = stores.map(store => store.name)
            /*** удаление существующих store из indexeddb если их нет в списке storeInfo (т.е. нет в схеме бд) */
            existedStores
                .filter(store => !storeNameList.includes(store))
                .forEach(store => db.deleteObjectStore(store))

            stores.forEach( (storeInfo) => {
                /*** проверяем существует ли в бд таблица с именем storeInfo.name */
                if (!db.objectStoreNames.contains(storeInfo.name)) {
                    const store = db.createObjectStore(storeInfo.name, {
                        keyPath: storeInfo.key,
                    });

                    storeInfo.indexes.forEach( (indexName) => {
                        store.createIndex(indexName, indexName, {});
                    });
                    /*** если store существует обновляем индексы для этого store */
                } else {
                    const store = transaction.objectStore(storeInfo.name)
                    const indexs = store.indexNames
                    storeInfo.indexes.forEach(index => {
                        if (!indexs.contains(index)) store.createIndex(index, index, {})
                    })
                    Array
                        .from(indexs)
                        .filter(index => !storeInfo.indexes.includes(index))
                        .forEach(index => store.deleteIndex(index))
                }
            });


            /***
             * обновление данных в бд, для обновления необходимо в
             * db/storeDB/schema добавить к store.upgrade метод который обновляет записи в бд
             */
            /*** отфильтровываем таблицы, для которых предусмотренно изменение данных */
            stores
                .filter(store => Array.isArray(store.upgrade))
                .forEach(store => {
                    console.log('upgrade store ' + store.name)
                    const idbStore = transaction.objectStore(store.name)
                    idbStore.openCursor()
                        .then((cursor) => transformStoreData(idbStore, cursor, store, oldVersion))
                })

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









export class DB{
    static add<T>(data:T, user_id: string, success?: Function, error?: Function): void{

    }

    static getOne<T>(id:IDBValidKey, success?:(data:T | undefined) => void, error?: (e: Error) => void): void{

    }

    static getMany<T>(range:IDBKeyRange, success?:(data:T[]) => void, error?: (e: Error) => void): void{

    }

    static getAll<T>(success?:(data:T[]) => void, error?: (e: Error) => void):void{

    }

    static getOneFromIndex<T>(index: keyof T, query: IDBValidKey, success?:(data:T | undefined) => void, error?: (e: Error) => void): void{

    }

    static getManyFromIndex<T>(index: keyof T, query: IDBKeyRange, success?:(data:T[]) => void, error?: (e: Error) => void): void{

    }

    static getAllFromIndex<T>(index: keyof T, count?:number,  success?:(data:T[]) => void, error?: (e: Error) => void): void{

    }

    static update<T>(data:T, user_id: string, success?: Function, error?: Function): void{

    }

    static delete<T>(data:T, user_id: string, success?: Function, error?: Function): void{

    }

}