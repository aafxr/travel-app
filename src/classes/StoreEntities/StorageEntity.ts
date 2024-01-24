import EventEmitter from "../EventEmmiter";

export abstract class StorageEntity extends EventEmitter{

    abstract dto(): { id: string, [key: string]: any }
}