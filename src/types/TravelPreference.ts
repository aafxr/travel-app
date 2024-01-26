/**
 * @name TravelPreferenceType
 * @typedef TravelPreferenceType
 * @property {DBFlagType} public
 * @property {DBFlagType} showRoute
 * @property {DBFlagType} showExpenses
 * @property {DBFlagType} showCheckList
 * @property {DBFlagType} showComments
 */
import {DBFlagType} from "./DBFlagType";

export interface TravelPreference {
    density: 1 | 2 | 3
}