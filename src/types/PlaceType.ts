/**
 * @name PlaceStoreType
 * @typedef {Object} PlaceStoreType
 * @property {string} _id
 * @property {string} id
 * @property {number} __day
 * @property {string} name
 * @property {string[]} photos
 * @property {string} formatted_address
 * @property {LocationType} location
 * @property {CoordinatesType} coords
 * @property {string} [time_start]
 * @property {string} [time_end]
 * @property {DBFlagType} visited
 * @category Types
 */

import {PlaceKind} from "./PlaceKindType";
import {DBFlagType} from "./DBFlagType";

/**
 * @name PlaceType
 * @typedef {Object} PlaceType
 * @property {string}           _id
 * @property {string}           id
 * @property {number}           type
 * @property {number}           __day
 * @property {string}           name
 * @property {string[]}         photos
 * @property {string}           formatted_address
 * @property {LocationType}     location
 * @property {CoordinatesType}  coords
 * @property {Date}             [time_start]
 * @property {Date}             [time_end]
 * @property {DBFlagType}       visited
 * @property {boolean} __expire
 * @category Types
 */


export type PlaceType = {
    _id: string,
    id: string,
    type: PlaceKind,
    day?: number,
    name: string,
    photos?: string[],
    formatted_addres: string,
    location: [number, number],
    coords: [number, number],
    time_start: Date,
    time_end: Date,
    visited: DBFlagType
}