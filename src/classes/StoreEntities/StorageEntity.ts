import {StoreName} from "../../types/StoreName";
import EventEmitter from "../EventEmmiter";

export abstract class StorageEntity extends EventEmitter{
    abstract storeName: StoreName
    abstract withAction: boolean

    abstract dto(): { id: string, [key: string]: any }
}