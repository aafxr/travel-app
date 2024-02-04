import {StoreEntity} from "../StoreEntities";
import {openIDBDatabase} from "./openIDBDatabaase";
import {StoreName} from "../../types/StoreName";
import {IndexName} from "../../types/IndexName";


export class DB {
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

    static async update<T>(storeName: StoreName, data: T) {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName, "readwrite")
        const store = tx.objectStore(storeName)
        if (data instanceof StoreEntity) store.put(data.dto())
        else store.put(data)
    }

    static async delete<T extends StoreEntity | IDBValidKey>(storeName: StoreName, data: T) {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName, "readwrite")
        const store = tx.objectStore(storeName)
        if (data instanceof StoreEntity) store.delete(data.dto().id)
        else store.delete(data)
    }

    static async getOne<T>(storeName: StoreName, id: IDBValidKey): Promise<T | undefined> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        return await store.get(id)
    }

    static async getMany<T>(storeName: StoreName, range: IDBKeyRange | IDBValidKey): Promise<T[]> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        return await store.getAll(range)
    }

    static async getAll<T>(storeName: StoreName, count?: number): Promise<T[]> {
        const db = await openIDBDatabase()
        return await db.transaction(storeName).objectStore(storeName).getAll(undefined, count)
    }

    static async getOneFromIndex<T>(storeName: StoreName, indexName: keyof T, query: IDBValidKey): Promise<T | undefined> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        const index = store.index(indexName as string)
        return await index.get(query)
    }

    static async getManyFromIndex<T>(storeName: StoreName, indexName: keyof T, query: IDBKeyRange | IDBValidKey): Promise<T[]> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        const index = store.index(indexName as string)
        return await index.getAll(query)
    }

    static async getAllFromIndex<T>(storeName: StoreName, indexName: keyof T, count?: number): Promise<T[]> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        const index = store.index(indexName as string)
        return await index.getAll(undefined, count)
    }


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


    static async getClosest<T>(storeName: StoreName, query: IDBKeyRange, count = 1): Promise<T[]> {
        const db = await openIDBDatabase()
        return await db.transaction(storeName).objectStore(storeName).getAll(query, count)
    }


    static async writeAll<T extends Pick<StoreEntity, 'dto'>>(elements: T[] = []) {
        if (!elements.length) return
        const storeNames = elements.map(el => el.constructor.name)
        const db = await openIDBDatabase()
        const tx = db.transaction(storeNames, 'readwrite')
        for (const el of elements) {
            const store = tx.objectStore(el.constructor.name)
            store.put(el.dto())
        }
    }


    static async writeAllToStore<T>(storeName: StoreName, items: T[]) {
        if (!items.length) return
        const db = await openIDBDatabase()
        const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
        await Promise.all(items.map(item => store.put(item)))
    }


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