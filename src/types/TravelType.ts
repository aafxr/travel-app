/**
 * @typedef TravelPreferenceType
 * @property {number} density время осмотра места по умолчанию
 * @property { 0b0 | 0b1 | 0b10 } eventsRate насыщеность (частота) событий
 */

/**
 * @typedef TravelPermissionType
 */

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
 *
 * @property {AppointmentStoreType[]} appointments список встреч
 * @property {MemberType[]} members список участников
 * @property {MovementType[]} movementTypes способ перемещения
 * @property {WaypointStoreType[]} waypoints список посещаемых мест
 * @property {PlaceStoreType[]} places список посещаемых мест
 *
 * @property {string} date_start начало путешествия
 * @property {string} date_end конец путешествия
 * @property {number} days число дней
 *
 * @property {number} members_count число взрослых
 * @property {number} children_count число детей
 * @property {string} photo фото путешествия
 *
 * @property {DBFlagType} isFromPoint флаг начала путешествия
 *
 * @property {TravelPreferenceType} preferences
 * @property {TravelPermissionType} permissions
 * @property {number} visibility
 */

import {TravelPermission} from "./TravelPermission";
import {TravelPreference} from "./TravelPreference";
import {Preference} from "../classes/Preference";
import {Permission} from "../classes/Permission";
import {InterestType} from "./InterestsType";
import {MovementType} from "./MovementType";
import {WaypointType} from "./WaypointType";
import {PlaceType} from "./PlaceType";
import {Road} from "../classes/StoreEntities";
import {RoadType} from "./RoadType";

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
 *
 * @property {AppointmentType[]} appointments список встреч
 * @property {string[]} members список id участников
 * @property {MovementType[]} movementTypes способ перемещения
 * @property {WaypointType[]} waypoints список посещаемых мест
 * @property {PlaceType[]} places список посещаемых мест
 *
 * @property {Date} date_start начало путешествия
 * @property {Date} date_end конец путешествия
 * @property {number} __days число дней
 *
 * @property {number} members_count число взрослых
 * @property {number} children_count число детей
 * @property {string} photo фото путешествия
 *
 * @property {DBFlagType} isFromPoint флаг начала путешествия
 *
 * @property {TravelPreferenceType} preferences
 * @property {TravelPermissionType} permissions
 * @property {number} visibility
 *
 * @property { Array<PlaceType | MovingType> } __route
 */


export type TravelType = {
    id: string,
    code: string,
    title: string,
    direction: string,
    description: string,
    owner_id: string,
    created_at: Date,
    updated_at: Date,
    // appointments: ,
    admins: string[],
    editors: string[],
    commentator: string[],
    movementTypes: MovementType[],
    waypoints: WaypointType[],
    places: PlaceType[],
    road: RoadType[],
    date_start:  Date,
    date_end: Date ,
    days: number,
    members_count: number,
    children_count: number,
    photo: string,
    isFromPoint: 0 | 1,
    preference: TravelPreference | Preference,
    permission:TravelPermission | Permission,
    // permissions: ,
    interests: InterestType[]
}