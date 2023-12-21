/**
 * @category Types
 * @name TravelStoreType
 * @typedef {object} TravelStoreType
 * @property {string} id id путешествия
 * @property {string} code символьный код путешествия
 * @property {string} title название путешествия
 * @property {string} direction краткое описание направления путешествия
 * @property {string} description описание путешествия
 * @property {string} owner_id автор путешествия
 * @property {string} created_at дата создания
 * @property {string} updated_at дата обнавления
 * @property {AppointmentStoreType[]} appointments список встреч
 * @property {MemberType[]} members список участников
 * @property {MovementType[]} movementTypes способ перемещения
 * @property {HotelStoreType[]} hotels список отелей
 * @property {PointStoreType[]} waypoints список посещаемых мест
 * @property {PlaceStoreType[]} places список посещаемых мест
 * @property {string} date_start начало путешествия
 * @property {string} date_end конец путешествия
 * @property {number} days число дней
 * @property {number} adults_count число взрослых
 * @property {number} childs_count число детей
 * @property {string} photo фото путешествия
 * @property {DBFlagType} isPublic флаг публичного путешествия
 * @property {DBFlagType} isFromPoint флаг начала путешествия
 */


/**
 * @category Types
 * @name TravelType
 * @typedef {object} TravelType
 * @property {string} id id путешествия
 * @property {string} code символьный код путешествия
 * @property {string} title название путешествия
 * @property {string} direction краткое описание направления путешествия
 * @property {string} description описание путешествия
 * @property {string} owner_id автор путешествия
 * @property {Date} created_at дата создания
 * @property {Date} updated_at дата обнавления
 * @property {AppointmentType[]} appointments список встреч
 * @property {string[]} members список id участников
 * @property {MovementType[]} movementTypes способ перемещения
 * @property {PointType[]} waypoints список посещаемых мест
 * @property {PlaceType[]} places список посещаемых мест
 * @property {Date} date_start начало путешествия
 * @property {Date} date_end конец путешествия
 * @property {number} days число дней
 * @property {number} adults_count число взрослых
 * @property {number} childs_count число детей
 * @property {string} photo фото путешествия
 * @property {DBFlagType} isPublic флаг публичного путешествия
 * @property {DBFlagType} isFromPoint флаг начала путешествия
 */