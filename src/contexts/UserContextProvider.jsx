/**
 * объект которы предоставляет telegram auth widget
 *@typedef {Object} UserAuthType
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {number} auth_date
 * @property {string} hash
 */

/**
 * @typedef {Object} UserAppType
 * @property {string} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} username
 * @property {string} photo
 * @property {string} token
 * @property {string} refresh_token
 */

/**
 * @function TelegramAuthHandler
 * @param {UserAuthType} user
 */

/**
 * @typedef {Object} UserContextType
 * @property {UserAppType | null} user
 * @property {TelegramAuthHandler} setUser
 */
