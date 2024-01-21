import {TravelType} from "../../types/TravelType";
import {MovementType} from "../../types/MovementType";
import {DBFlagType} from "../../types/DBFlagType";
import {Preferences} from "../Preferences";
import Place from "./Place";
import Waypoint from "./Waypoint";
import EventEmitter from "../EventEmmiter";
import {nanoid} from "nanoid";
import storeDB from "../../db/storeDB/storeDB";
import {StoreName} from "../../types/StoreName";
import Action from "./Action";
import {ActionName} from "../../types/ActionsType";
import {WithDTOMethod} from "../../types/WithDTOMethod";
import {WithStoreProps} from "../../types/WithStoreProps";


export enum TravelEventName {
    UPDATE = "update",
}


export default class Travel2 extends EventEmitter implements TravelType, WithDTOMethod, WithStoreProps{
    storeName: StoreName = StoreName.TRAVEL;
    withAction = true


    id = nanoid(8);
    code = '';
    description = '';
    direction = '';
    owner_id = '';
    photo = '';
    title = '';

    days = 1
    isFromPoint: DBFlagType = 0
    children_count = 0
    members_count = 1
    visibility: DBFlagType = 0

    created_at = new Date();
    date_end = new Date(new Date().setHours(23, 59, 59, 999));
    date_start = new Date();

    movementTypes: MovementType[] = [MovementType.CAR];
    preferences = new Preferences({});
    updated_at = new Date();
    places: Place[] = [];
    waypoints: Waypoint[] = [];

    constructor(travel: Partial<TravelType>) {
        super()
        if (travel.id) this.id = travel.id
        if (travel.title) this.title = travel.title
        if (travel.code) this.code = travel.code
        if (travel.direction) this.direction = travel.direction
        if (travel.isFromPoint) this.isFromPoint = travel.isFromPoint
        if (travel.owner_id) this.owner_id = travel.owner_id
        if (travel.days) this.days = travel.days
        if (travel.description) this.description = travel.description
        if (travel.members_count && travel.members_count > 1) this.members_count = travel.members_count
        if (travel.movementTypes) this.movementTypes = travel.movementTypes
        if (travel.photo) this.photo = travel.photo
        if (travel.places) this.places = travel.places.map(p => new Place(p))
        if (travel.waypoints) this.waypoints = travel.waypoints.map(w => new Waypoint(w))
        if (travel.visibility) this.visibility = travel.visibility
        if (travel.preferences) this.preferences = new Preferences(travel.preferences)
        if (travel.created_at) this.created_at = new Date(travel.created_at)
        if (travel.date_start) this.date_start = new Date(travel.date_start)
        if (travel.date_end) this.date_end = new Date(travel.date_end)
        if (travel.updated_at) this.updated_at = new Date(travel.updated_at)
    }

    setId(id: string) {
        this.id = id
        this.emit(TravelEventName.UPDATE)
    }

    setCode(code: string) {
        this.code = code
        this.emit(TravelEventName.UPDATE)
    }

    setDescription(description: string) {
        this.description = description
        this.emit(TravelEventName.UPDATE)
    }

    setDirection(direction: string) {
        this.direction = direction
        this.emit(TravelEventName.UPDATE)
    }

    setOwner_id(owner_id: string) {
        this.owner_id = owner_id
        this.emit(TravelEventName.UPDATE)
    }

    setPhoto(photo: string) {
        this.photo = photo
        this.emit(TravelEventName.UPDATE)
    }

    setTitle(title: string) {
        this.title = title
        this.emit(TravelEventName.UPDATE)
    }

    setDays(days: number) {
        this.days = days
        this.emit(TravelEventName.UPDATE)
    }

    setIsFromPoint(isFromPoint: DBFlagType) {
        this.isFromPoint = isFromPoint
        this.emit(TravelEventName.UPDATE)
    }

    setChildren_count(children_count: number) {
        this.children_count = children_count
        this.emit(TravelEventName.UPDATE)
    }

    setMembers_count(members_count: number) {
        this.members_count = members_count
        this.emit(TravelEventName.UPDATE)
    }

    setVisibility(visibility: DBFlagType) {
        this.visibility = visibility
        this.emit(TravelEventName.UPDATE)
    }

    setDate_end(date_end: Date) {
        this.date_end = new Date(date_end.setHours(23, 59, 59, 999))
        this.emit(TravelEventName.UPDATE)
    }

    setDate_start(date_start: Date) {
        this.date_start = new Date(date_start.setHours(0, 0, 0, 0))
        this.emit(TravelEventName.UPDATE)
    }

    dto(): TravelType {
        return {
            id: this.id,
            code: this.code,
            description: this.description,
            direction: this.direction,
            owner_id: this.owner_id,
            photo: this.photo,
            title: this.title,
            days: this.days,
            isFromPoint: this.isFromPoint,
            children_count: this.children_count,
            members_count: this.members_count,
            visibility: this.visibility,
            created_at: this.created_at,
            date_end: this.date_end,
            date_start: this.date_start,
            movementTypes: this.movementTypes,
            places: this.places.map(p => p.dto()),
            preferences: this.preferences.dto(),
            waypoints: this.waypoints.map(w => w.dto()),
            updated_at: this.updated_at,
        }
    }

    save(user_id = '', success = () => {}, error = (e: Error) => {}) {
        storeDB.getOne(StoreName.TRAVEL, this.id)
            .then(async (travel) => {
                let action
                if (travel) {
                    await storeDB.editElement(StoreName.TRAVEL, this.dto())
                    action = new Action(this.dto(), user_id, StoreName.TRAVEL, ActionName.UPDATE)
                } else {
                    await storeDB.addElement(StoreName.TRAVEL, this.dto())
                    action = new Action(this.dto(), user_id, StoreName.TRAVEL, ActionName.ADD)
                }

                await storeDB.addElement(StoreName.ACTION, action)
            })
            .then(success)
            .catch(error)
    }





    // delete(user_id = '', success = () => {}, error = (e: Error) => {}) {
    //     const action = new Action(this.dto(), user_id, StoreName.TRAVEL, ActionName.DELETE)
    //
    //     Promise.all([
    //         storeDB.addElement(StoreName.ACTION, action),
    //         storeDB.removeElement(StoreName.TRAVEL, this.id)
    //     ])
    //         .then(success)
    //         .catch(error)
    // }


}



