import EventEmitter from "../EventEmmiter";

export abstract class StoreEntity extends EventEmitter{

    abstract dto(): { id: string, [key: string]: any }
}