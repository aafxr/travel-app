import {DBFlagType} from "./DBFlagType";

export interface TravelPermission{
    public: DBFlagType,
    showRoute: DBFlagType,
    showExpenses: DBFlagType,
    showCheckList: DBFlagType,
    showComments: DBFlagType,
}