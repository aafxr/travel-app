import {StoreEntity} from "../StoreEntities";
import {openIDBDatabase} from "./openIDBDatabaase";
import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";

/**
 * @class DB
 *
 * интерфейс для работы с indexedDB
 *
 *
 * данный интерфейс добавляет следующие статические методы:
 * - __add__                добавляет запись в стор
 * - __update__             обнавляет запись в стор
 * - __delete__             удаляет запись в стор
 * - __getOne__             возвращает 1 запись из стор или undefined
 * - __getMany__            возвращает все записи удовлетворяющие запросу из стор или []
 * - __getAll__             возвращает все записи из стор или []
 * - __getOneFromIndex__    возвращает 1 запись из стор по указанномку индексу или undefined
 * - __getManyFromIndex__   возвращает все записи по указанномку индексу удовлетворяющие запросу из стор или []
 * - __getAllFromIndex__    возвращает все записи по указанномку индексу из стор или []
 * - __getManyByIds__       возвращает все найденые записи из стор по полученному списку id из стор или []
 * - __getClosest__         возвращает массив ближайших записей (по умолчанию 1) удовлетворяющую запросу или undefined
 * - __writeAll__           принимает массив инстансов __наследников класса StoreEntity__ и записывает все элементы в соответствующий массив
 * - __writeAllToStore__    записывает список обектов в указанный стор
 * - __openCursor__         возвращает курсор, позволяет пройтись по всем записям в бд
 * - __openIndexCursor__    возвращает курсор по указанному индексу, позволяет пройтись по всем записям в бд
 *
 */
export class DB {
    /**
     * добавляет запись в стор
     * @param storeName
     * @param data
     */
    static async add<T>(storeName: StoreName, data: T) {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName, "readwrite")
        const store = tx.objectStore(storeName)
        try {
            if (data instanceof StoreEntity) store.add(data.dto())
            else store.add(data)
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * обнавляет запись в стор
     * @param storeName
     * @param data
     */
    static async update<T>(storeName: StoreName, data: T) {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName, "readwrite")
        const store = tx.objectStore(storeName)
        if (data instanceof StoreEntity) store.put(data.dto())
        else store.put(data)
    }

    /**
     * удаляет запись в стор
     * @param storeName
     * @param data
     */
    static async delete<T extends StoreEntity | IDBValidKey>(storeName: StoreName, data: T) {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName, "readwrite")
        const store = tx.objectStore(storeName)
        if (data instanceof StoreEntity) store.delete(data.dto().id)
        else store.delete(data)
    }

    /**
     * возвращает 1 запись из стор или undefined
     * @param storeName
     * @param id
     */
    static async getOne<T>(storeName: StoreName, id: IDBValidKey): Promise<T | undefined> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        return await store.get(id)
    }

    /**
     * возвращает все записи удовлетворяющие запросу из стор или []
     * @param storeName
     * @param range
     */
    static async getMany<T>(storeName: StoreName, range: IDBKeyRange | IDBValidKey, count?:number): Promise<T[]> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        return await store.getAll(range, count)
    }

    /**
     * возвращает все записи из стор или []
     * @param storeName
     * @param count
     */
    static async getAll<T>(storeName: StoreName, count?: number): Promise<T[]> {
        const db = await openIDBDatabase()
        return await db.transaction(storeName).objectStore(storeName).getAll(undefined, count)
    }

    /**
     * возвращает 1 запись из стор по указанномку индексу или undefined
     * @param storeName
     * @param indexName
     * @param query
     */
    static async getOneFromIndex<T>(storeName: StoreName, indexName: keyof T, query: IDBValidKey): Promise<T | undefined> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        const index = store.index(indexName as string)
        return await index.get(query)
    }

    /**
     * возвращает все записи по указанномку индексу удовлетворяющие запросу из стор или []
     * @param storeName
     * @param indexName
     * @param query
     */
    static async getManyFromIndex<T>(storeName: StoreName, indexName: keyof T, query: IDBKeyRange | IDBValidKey, count?:number): Promise<T[]> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        const index = store.index(indexName as string)
        return await index.getAll(query, count)
    }

    /**
     * возвращает все записи по указанномку индексу из стор или []
     * @param storeName
     * @param indexName
     * @param count
     */
    static async getAllFromIndex<T>(storeName: StoreName, indexName: keyof T, count?: number): Promise<T[]> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        const index = store.index(indexName as string)
        return await index.getAll(undefined, count)
    }


    /**
     * возвращает все найденые записи из стор по полученному списку id из стор или []
     * @param storeName
     * @param ids
     */
    static async getManyByIds<T extends { id: string }>(storeName: StoreName, ids: string[]): Promise<T[]> {
        if (!ids.length) return []
        const list = new Set(ids)
        const cursor = DB.openCursor<T>(storeName)
        const result: T[] = []
        while (list.size) {
            const item = (await cursor.next()).value as T
            if (!item) break
            if (list.has(item.id)) {
                list.delete(item.id)
                result.push(item)
            }
        }
        return result
    }


    /**
     * возвращает массив ближайших записей (по умолчанию 1) удовлетворяющую запросу или undefined
     * @param storeName
     * @param query
     * @param count
     */
    static async getClosest<T>(storeName: StoreName, query: IDBKeyRange, count = 1): Promise<T[]> {
        const db = await openIDBDatabase()
        return await db.transaction(storeName).objectStore(storeName).getAll(query, count)
    }


    /**
     * принимает массив инстансов __наследников класса StoreEntity__ и записывает все элементы в соответствующий массив
     * @param elements
     */
    static async writeAll<T extends Pick<StoreEntity, 'dto' | 'storeName'>>(elements: T[] = []) {
        if (!elements.length) return
        const storeNames = elements.map(el => el.storeName)
        const set = new Set(storeNames)
        const db = await openIDBDatabase()
        const tx = db.transaction([...set], 'readwrite')
        for (const el of elements) {
            const store = tx.objectStore(el.storeName)
            store.put(el.dto())
        }
    }


    /**
     * записывает список обектов в указанный стор
     * @param storeName
     * @param items
     */
    static async writeAllToStore<T>(storeName: StoreName, items: T[]) {
        if (!items.length) return
        const db = await openIDBDatabase()
        const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
        await Promise.all(items.map(item => store.put(item)))
    }


    /**
     * возвращает курсор, позволяет пройтись по всем записям в бд
     * @example
     *     const cursor = await DB.openCursor<ExpenseType>(StoreName.EXPENSE)
     *     let expense = (await cursor.next()).value
     *     while (expense) {
     *     //do something ....
     *     expense = (await cursor.next()).value
     *     }
     *
     * @param storeName
     * @param query
     * @param direction
     */
    static async* openCursor<T>(storeName: StoreName, query?: IDBValidKey | IDBKeyRange, direction?: IDBCursorDirection) {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        let cursor = await store.openCursor(query, direction)
        while (cursor) {
            yield cursor.value as T
            cursor = await cursor.continue()
        }
    }

    /**
     * возвращает курсор по указанному индексу, позволяет пройтись по всем записям в бд
     * @example
     *     const cursor = await DB.openIndexCursor<ExpenseType>(StoreName.EXPENSE, IndexName.PRIMARY_ENTITY_ID)
     *     let expense = (await cursor.next()).value
     *     while (expense) {
     *     //do something ....
     *     expense = (await cursor.next()).value
     *     }
     * @param storeName
     * @param indexName
     * @param query
     * @param direction
     */
    static async* openIndexCursor<T>(storeName: StoreName,indexName: IndexName, query?: IDBValidKey | IDBKeyRange, direction?: IDBCursorDirection) {
        const db = await openIDBDatabase()
        const index = db.transaction(storeName).objectStore(storeName).index(indexName)
        let cursor = await index.openCursor(query, direction)
        while (cursor) {
            yield cursor.value as T
            cursor = await cursor.continue()
        }
    }
}