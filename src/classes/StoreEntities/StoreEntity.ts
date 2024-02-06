import {StoreName} from "../../types/StoreName";


/**
 * абстракция для объектов, которые в планах хранить в indexeddb
 *
 * - storeName имя стор в бд
 * - dto() метод возвращает представление, которое будет записанно в бд
 */
export abstract class StoreEntity {
    abstract storeName: StoreName

    abstract dto(): { id: string, [key: string]: any }

    clone(): this {
        const clone_item = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        clone_item.events = new Map()
        return clone_item
    }
}