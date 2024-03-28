import {DBStoreDescriptionType} from "../../types/DBStoreDescriptionType";
import {DB_NAME, DB_STORES, DB_VERSION} from "./db-constants";
import {pushAlertMessage} from "../../components/Alerts/Alerts";
import {openDB} from "idb";


/**
 * метод открывает соединение с indexeddb и при необходимости делает upgrade бд
 * @param dbname
 * @param version
 * @param stores список представляет описание стор (ключи и список индексов )
 */
export async function openIDBDatabase(dbname: string = DB_NAME, version = DB_VERSION, stores: DBStoreDescriptionType[] = DB_STORES) {
    return await openDB(dbname, version, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            // Array.from(db.objectStoreNames).forEach(storeName => db.deleteObjectStore(storeName))

            const existedStores = Array.from(db.objectStoreNames)
            const storeNameList = stores.map(store => store.name as string)

            console.log(existedStores)
            console.log(storeNameList)

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

            console.warn(event)
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
