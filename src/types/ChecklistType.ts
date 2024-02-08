import {DBFlagType} from "./DBFlagType";

export interface ChecklistType{
    id: string,
    records:{
        [key: string]:  DBFlagType
    }
}