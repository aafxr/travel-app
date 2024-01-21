import {StoreName} from "./StoreName";
import {IndexName} from "./IndexName";

export interface DBStoreDescriptionType {
    name: StoreName
    key: string
    indexes: IndexName[]
}