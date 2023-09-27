/**
 * @typedef {object} AppointmentType
 * @property {string} id
 * @property {string} title
 * @property {Date} date
 * @property time
 * @property {string} description
 * @property {string} [primary_entity_id]
 */

/**
 * @typedef {object} MemberType
 * @property {string} id
 * @property movementType
 * @property {Array} access_rights
 */

/**
 * @typedef {object} HotelType
 * @property {string} id
 * @property {string} title
 * @property {string} location
 * @property {Date} check_in
 * @property {Date} check_out
 */

/**
 * @typedef {object} HotelType
 * @property {string} id
 * @property {string} title
 * @property {string} location
 * @property {Date} check_in
 * @property {Date} check_out
 */

/**
 * @typedef {object} MovementType
 * @property {string} id
 * @property {string} title
 * @property {JSX.Element} icon
 */


/**
 * @typedef {object} TravelType
 * @property {string} id
 * @property {string} code
 * @property {string} title
 * @property {string} owner_id
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {AppointmentType[]} appointments
 * @property {MemberType[]} members
 * @property {HotelType[]} hotels
 * @property {MovementType[]} movementTypes
 * @property {Date} date_start
 * @property {Date} date_end
 */

// id
// code
// title
// owner_id
// created_at
// updated_at

// appointments
// members
// hotels
// movementTypes

// date_start
// date_end
