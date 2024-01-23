/**
 * @name TravelPreferencesType
 * @typedef TravelPreferencesType
 * @property {DBFlagType} public
 * @property {DBFlagType} showRoute
 * @property {DBFlagType} showExpenses
 * @property {DBFlagType} showCheckList
 * @property {DBFlagType} showComments
 */
import {DBFlagType} from "./DBFlagType";

export interface TravelPreferences {
    public: DBFlagType,
    showRoute: DBFlagType,
    showExpenses: DBFlagType,
    showCheckList: DBFlagType,
    showComments: DBFlagType,

    density: 1 | 2 | 3
}