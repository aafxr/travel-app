import {TravelType} from "../types/TravelType";
import {MovementType} from "../types/MovementType";
import {WaypointType} from "../types/WaypointType";
import {DBFlagType} from "../types/DBFlagType";
import {TravelPreferences} from "../types/TravelPreferences";
import {PlaceType} from "../types/PlaceType";
import {Preferences} from "./Preferences";
import Place from "./Place";
import Waypoint from "./Waypoint";
import Subscription from "./Subscription";
import EventEmitter from "./EventEmmiter";
import {nanoid} from "nanoid";
import storeDB from "../db/storeDB/storeDB";
import {StoreName} from "../types/StoreName";


export enum TravelEnetName{
    UPDATE= "update",
}

export class Travel2 extends EventEmitter implements TravelType {


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
    places: PlaceType[] = [];
    preferences = new Preferences({});
    updated_at= new Date();
    waypoints: WaypointType[] = [];

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
        if(travel.preferences) this.preferences = new Preferences(travel.preferences)
        if (travel.created_at) this.created_at = new Date(travel.created_at)
        if (travel.date_start) this.date_start = new Date(travel.date_start)
        if (travel.date_end) this.date_end = new Date(travel.date_end)
        if (travel.updated_at) this.updated_at = new Date(travel.updated_at)
    }

    setId(id:string){
        this.id = id
        this.emit(TravelEnetName.UPDATE)
    }
    setCode(code:string){
        this.code = code
        this.emit(TravelEnetName.UPDATE)
    }
    setDescription(description:string){
        this.description = description
        this.emit(TravelEnetName.UPDATE)
    }
    setDirection(direction:string){
        this.direction = direction
        this.emit(TravelEnetName.UPDATE)
    }
    setOwner_id(owner_id:string){
        this.owner_id = owner_id
        this.emit(TravelEnetName.UPDATE)
    }
    setPhoto(photo:string){
        this.photo = photo
        this.emit(TravelEnetName.UPDATE)
    }
    setTitle(title:string){
        this.title = title
        this.emit(TravelEnetName.UPDATE)
    }

    setDays(days: number){
        this.days = days
        this.emit(TravelEnetName.UPDATE)
    }
    setIsFromPoint(isFromPoint: DBFlagType){
        this.isFromPoint = isFromPoint
        this.emit(TravelEnetName.UPDATE)
    }
    setChildren_count(children_count: number){
        this.children_count = children_count
        this.emit(TravelEnetName.UPDATE)
    }
    setMembers_count(members_count: number){
        this.members_count = members_count
        this.emit(TravelEnetName.UPDATE)
    }
    setVisibility(visibility: DBFlagType){
        this.visibility = visibility
        this.emit(TravelEnetName.UPDATE)
    }

    setDate_end(date_end: Date){
        this.date_end = new Date(date_end.setHours(23,59,59,999))
        this.emit(TravelEnetName.UPDATE)
    }
    setDate_start(date_start: Date){
        this.date_start = new Date(date_start.setHours(0,0,0,0))
        this.emit(TravelEnetName.UPDATE)
    }

    save(user_id = '', success = () =>{} , error = (e: Error) => {}){
        storeDB.getOne(StoreName.TRAVEL, this.id)
            .then(travel => )
    }
}