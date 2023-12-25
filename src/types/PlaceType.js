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

/**
 * @name PlaceType
 * @typedef {Object} PlaceType
 * @property {string} _id
 * @property {string} id
 * @property {2001} type
 * @property {number} __day
 * @property {string} name
 * @property {string[]} photos
 * @property {string} formatted_address
 * @property {LocationType} location
 * @property {CoordinatesType} coords
 * @property {Date} [time_start]
 * @property {Date} [time_end]
 * @property {DBFlagType} visited
 * @property {boolean} __expire
 * @category Types
 */