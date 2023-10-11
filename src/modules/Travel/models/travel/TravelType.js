/**
 * @category Types
 * @name AppointmentType
 * @typedef {object} AppointmentType
 * @property {string} id
 * @property {string} title
 * @property {Date} date
 * @property time
 * @property {string} description
 * @property {string} [primary_entity_id]
 */

/**
 * @category Types
 * @name PermissionType
 * @typedef {object} PermissionType
 * @property {string} id
 * @property {string} title
 */


/**
 * @category Types
 * @name MemberType
 * @typedef {object} MemberType
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} inviteURL
 * @property {string} isChild
 * @property {number} age
 * @property {MovementType[]} movementType
 * @property {PermissionType[]} permissions
 */

/**
 * @category Types
 * @name HotelType
 * @typedef {object} HotelType
 * @property {string} id
 * @property {string} title
 * @property {string} location
 * @property {string} check_in
 * @property {string} check_out
 */

/**
 * @category Types
 * @name MovementType
 * @typedef {object} MovementType
 * @property {string} id
 * @property {string} title
 * @property {JSX.Element} [icon]
 */


/**
 * @category Types
 * @name TravelType
 * @typedef {object} TravelType
 * @property {string} id id путешествия
 * @property {string} code символьный код путешествия
 * @property {string} title название путешествия
 * @property {string} direction описание путешествия
 * @property {string} owner_id автор путешествия
 * @property {Date} created_at дата создания
 * @property {Date} updated_at дата обнавления
 * @property {AppointmentType[]} appointments список встреч
 * @property {MemberType[]} members список участников
 * @property {HotelType[]} hotels список отелей
 * @property {MovementType[]} movementTypes способ перемещения
 * @property {InputPoint[]} waypoints список посещаемых мест
 * @property {string} date_start начало путешествия
 * @property {string} date_end конец путешествия
 * @property {number} adults_count число взрослых
 * @property {number} childs_count число детей
 * @property {string} photo фото путешествия
 * @property {boolean} isPublic флаг публичного путешествия
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
// photo
