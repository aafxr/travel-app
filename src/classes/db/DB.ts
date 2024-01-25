import {StorageEntity, Travel} from "../StoreEntities";
import {openIDBDatabase} from "./openIDBDatabaase";
import {StoreName} from "../../types/StoreName";


export class DB {
    static async add<T>(storeName: StoreName, data: T) {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName, "readwrite")
        const store = tx.objectStore(storeName)
        try {
            if (data instanceof StorageEntity) store.add(data.dto())
            else store.add(data)
        } catch (e) {
            console.error(e)
        }
    }

    static async update<T>(storeName: StoreName, data: T) {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName, "readwrite")
        const store = tx.objectStore(storeName)
        if (data instanceof StorageEntity) store.put(data.dto())
        else store.put(data)
    }

    static async delete<T extends StorageEntity | IDBValidKey>(storeName: StoreName, data: T) {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName, "readwrite")
        const store = tx.objectStore(storeName)
        if (data instanceof StorageEntity) store.delete(data.dto().id)
        else store.delete(data)
    }

    static async getOne<T>(storeName: StoreName, id: IDBValidKey): Promise<T | undefined> {
        const db = await openIDBDatabase()
        const tx = db.transaction(storeName)
        const store = tx.objectStore(storeName)
        return await store.get(id)
    }

    static async getMany<T>(storeName: StoreName, range: IDBKeyRange): Promise<T[]> {
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

    static async getManyFromIndex<T>(storeName: StoreName, indexName: keyof T, query: IDBKeyRange): Promise<T[]> {
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

    static async writeAll<T extends Pick<StorageEntity, 'dto'>>(elements: T[] = []) {
        if (!elements.length) return
        const storeNames = elements.map(el => el.constructor.name)
        const db = await openIDBDatabase()
        const tx = db.transaction(storeNames, 'readwrite')
        for (const el of elements) {
            const store = tx.objectStore(el.constructor.name)
            store.put(el.dto())
        }
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
}