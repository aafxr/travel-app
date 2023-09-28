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
 * @property {string} name
 * @property {string} email
 * @property {string} inviteURL
 * @property {string} isChild
 * @property {number} age
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
 * @property {string} date_start
 * @property {string} date_end
 * @property {number} adults_count
 * @property {number} childs_count
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
// adults_count
// childs_count
