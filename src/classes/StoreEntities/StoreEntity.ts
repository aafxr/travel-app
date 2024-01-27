import EventEmitter from "../EventEmmiter";

export abstract class StoreEntity extends EventEmitter{

    abstract dto(): { id: string, [key: string]: any }

    clone(): this{
        const clone_item =  Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        clone_item.events = new Map()
        return clone_item
    }
}