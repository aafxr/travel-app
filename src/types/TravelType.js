/**
 * @category Types
 * @name TravelType
 * @typedef {object} TravelType
 * @property {string} id id путешествия
 * @property {string} code символьный код путешествия
 * @property {string} title название путешествия
 * @property {string} direction описание путешествия
 * @property {string} owner_id автор путешествия
 * @property {string} created_at дата создания
 * @property {string} updated_at дата обнавления
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
 * @property {DBFlagType} isPublic флаг публичного путешествия
 */