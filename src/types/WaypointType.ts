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

import {CoordinatesType} from "./CoordinatesType";

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

export interface WaypointType{
    id: string,
    coords: CoordinatesType,
    address: string,
    locality: string,
}