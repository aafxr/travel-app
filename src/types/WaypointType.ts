/**
 * @description предпологаемое описание точки на карте
 * @typedef {Object} WaypointStoreType
 * @name WaypointStoreType
 * @property {string} id идентификатор точки
 * @property {[number, number]} coords координаты
 * @property {string} kind тип точки (?)
 * @property {string} address аддрес
 * @property {string} locality улица / город / дом ...
 * @category Types
 */

/**
 * @description предпологаемое описание точки на карте
 * @typedef {Object} WaypointType
 * @name WaypointType
 * @property {string} id идентификатор точки
 * @property {2002} type
 * @property {[number, number]} coords координаты
 * @property {string} kind тип точки (?)
 * @property {string} address аддрес
 * @property {string} locality улица / город / дом ...
 * @category Types
 */

export type WaypointType = {
    id: string,
    coords: [number, number],
    address: string,
    locality: string,
}