/**
 * объект которы предоставляет telegram auth widget
 * @name UserAuthType
 * @typedef {Object} UserAuthType
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {number} auth_date
 * @property {string} hash
 * @category Types
 */

/**
 * Тип, описывающий данные пользователя
 * @name UserAppType
 * @typedef {Object} UserAppType
 * @property {string} id id пользователя
 * @property {string} first_name имя пользователя
 * @property {string} last_name фамилия пользователя
 * @property {string} username никнейм пользователя
 * @property {string} photo url ссылка на фото пользователя
 * @property {string} token access token
 * @property {string} refresh_token refresh token
 * @category Types
 */

/**
 * Handler , который вызывается telegram auth widget  для дальнейшей обработки данных пользователя
 * @name TelegramAuthHandler
 * @function TelegramAuthHandler
 * @param {UserAuthType} user полученные данные пользователя из telegram
 * @category Utils
 */

/**
 * @typedef {Object} UserContextType
 * @property {UserAppType | null} user
 * @property {TelegramAuthHandler} setUser
 */
