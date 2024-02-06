import {nanoid} from "nanoid";
import getDistanceFromTwoPoints from "../../utils/getDistanceFromTwoPoints";
import {DEFAULT_IMG_URL, MS_IN_DAY} from "../../static/constants";
import {TravelPermission} from "../../types/TravelPermission";
import {TravelPreference} from "../../types/TravelPreference";
import {MovementType} from "../../types/MovementType";
import {TravelType} from "../../types/TravelType";
import {DBFlagType} from "../../types/DBFlagType";
import {StoreEntity} from "./StoreEntity";
import {Preference} from "../Preference";
import {Permission} from "../Permission";
import {Waypoint} from "./Waypoint";
import {Member} from "./Member";
import {Place} from "./Place";
import {Photo} from "./Photo";
import {Road} from "./Road";
import {StoreName} from "../../types/StoreName";


type TravelPropsType = Partial<TravelType> | Travel


const zero_time = new Date(0)
zero_time.setHours(0, 0, 0, 0)

const HOUR_IN_MS = MS_IN_DAY / 24
const MIDDLE_TIME = HOUR_IN_MS * 13

/**
 * представление основной сущности путешествия
 */
export class Travel extends StoreEntity implements Omit<TravelType, 'photo'> {
    storeName = StoreName.TRAVEL

    id = nanoid(8);
    code = '';
    description = '';
    direction = '';
    owner_id = '';
    title = '';

    photo: string = '';
    image?: Photo

    days = 1
    isFromPoint: DBFlagType = 0
    children_count = 0
    members_count = 1

    created_at = new Date();
    date_end = new Date(0);
    date_start = new Date(0);

    movementTypes: MovementType[] = [MovementType.CAR];
    updated_at = new Date();
    places: Place[] = [];
    road: Road[] = [];
    waypoints: Waypoint[] = [];

    admins: string[] = [];
    editors: string[] = [];
    commentator: string[] = [];

    preference = new Preference();
    permission: Permission = new Permission();

    interests = []


    constructor(travel: TravelPropsType) {
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
        if (travel.movementTypes) this.movementTypes = (travel.movementTypes as any).map((mt: any) => (mt['id'] ? mt['id'] : mt) as MovementType)
        if (travel.photo) this.photo = travel.photo
        if (travel.places) this.places = travel.places.map(p => new Place(p))
        if (travel.road) this.road = travel.road.map(r => new Road(r))
        if (travel.waypoints) this.waypoints = travel.waypoints.map(w => new Waypoint(w))

        if (travel.created_at) this.created_at = new Date(travel.created_at)
        if (travel.date_start) this.date_start = new Date(travel.date_start)
        if (travel.date_end) this.date_end = new Date(travel.date_end)
        if (travel.updated_at) this.updated_at = new Date(travel.updated_at)

        if (travel.admins) this.admins = travel.admins
        if (travel.editors) this.editors = travel.editors
        if (travel.commentator) this.commentator = travel.commentator

        if (travel.preference) Object.assign(this.preference, new Preference(travel.preference).dto())
        if (travel.permission) Object.assign(this.permission, new Permission(travel.permission).dto())
    }


    static setId(travel: Travel, id: string) {
        travel.id = id
        Travel.setUpdated_at(travel)
    }

    static setCode(travel: Travel, code: string) {
        travel.code = code
        Travel.setUpdated_at(travel)
    }

    static setDescription(travel: Travel, description: string) {
        travel.description = description
        Travel.setUpdated_at(travel)
    }

    static setDirection(travel: Travel, direction: string) {
        travel.direction = direction
        Travel.setUpdated_at(travel)
    }

    static setOwner_id(travel: Travel, owner_id: string) {
        travel.owner_id = owner_id
        Travel.setUpdated_at(travel)
    }

    get members() {
        return [this.owner_id, ...this.admins, ...this.editors, ...this.commentator]
    }

    static setMovementTypes(travel: Travel, movementTypes: MovementType[]) {
        travel.movementTypes = movementTypes
        Travel.setUpdated_at(travel)
    }

    static addPlace(travel: Travel, place: Place) {
        if (!travel.places.length) {
            let start = new Date(0)
            start.setTime(zero_time.getTime() + MIDDLE_TIME - HOUR_IN_MS * (travel.preference.density / Preference.base_density))
            const end = new Date(start.getTime() + Preference.base_duration * (travel.preference.depth / Preference.base_depth))
            place.time_start = start
            place.time_end = end
            travel.places.push(place)
        } else {
            const last = travel.places[travel.places.length - 1]
            const dist = getDistanceFromTwoPoints(place.location, last.location)
            const road = new Road({
                time_start: last.time_end,
                distance: dist,
                from: last.location,
                to: place.location
            })
            let r_idx = 0
            travel.road.forEach(r => r.time_start > road.time_start && r_idx++)
            travel.road.splice(r_idx, 0, road)
            let start: Date
            const hh = road.time_end.getHours()
            if (hh < 16 && hh > 9) {
                start = new Date(road.time_end)
            } else {
                const t = new Date(road.time_end)
                t.setHours(0, 0, 0, 0)
                t.setTime(t.getTime() + MS_IN_DAY + MIDDLE_TIME - HOUR_IN_MS * (travel.preference.density / Preference.base_density))
                start = t
            }

            const end = new Date(start.getTime() + Preference.base_duration * (travel.preference.depth / Preference.base_depth))
            place.time_start = start
            place.time_end = end
            travel.places.push(place)
        }
    }

    static setPlaces(travel: Travel, places: Place[]) {
        travel.road = []
        travel.places = []
        for (const place of places)
            Travel.addPlace(travel, place)
        Travel.setUpdated_at(travel)
    }


    static removePlace(travel : Travel,place: Place) {
        travel.places = travel.places.filter(p => p._id !== place._id)
        travel.road = []
        if (travel.places.length > 1) {
            for (let i = 1; i < travel.places.length; i++) {
                const place_1 = travel.places[i - 1]
                const place_2 = travel.places[i]
                const dist = getDistanceFromTwoPoints(place_1.location, place_2.location)
                const road = new Road({
                    time_start: place_1.time_end,
                    distance: dist,
                    from: place_1.location,
                    to: place_2.location
                })
                let r_idx = 0
                travel.road.forEach(r => (r.time_start > road.time_start) && r_idx++)
                travel.road[r_idx] = road
            }
        }
        Travel.setUpdated_at(travel)
    }


    static setWaypoints(travel: Travel, waypoints: Waypoint[]) {
        travel.waypoints = waypoints
        Travel.setUpdated_at(travel)
    }

    static setPhoto(travel: Travel, photo: Photo) {
        if (travel.photo) photo.id = travel.photo
        else travel.photo = photo.id

        travel.image?.destroy()
        travel.image = photo
        Travel.setUpdated_at(travel)
    }

    get getPhotoURL() {
        if (this.image) return this.image.src
        return DEFAULT_IMG_URL
    }

    static setTitle(travel: Travel, title: string) {
        travel.title = title
        Travel.setUpdated_at(travel)
    }

    static setDays(travel: Travel, days: number) {
        if(days < 1) return
        travel.date_end = new Date(travel.date_start.getTime() + MS_IN_DAY * days)
        travel.days = days
        Travel.setUpdated_at(travel)
    }

    static setIsFromPoint(travel: Travel, isFromPoint: DBFlagType) {
        travel.isFromPoint = isFromPoint
        Travel.setUpdated_at(travel)
    }

    static setChildren_count(travel: Travel, children_count: number) {
        travel.children_count = children_count
        Travel.setUpdated_at(travel)
    }

    static setMembers_count(travel: Travel, members_count: number) {
        travel.members_count = members_count
        Travel.setUpdated_at(travel)
    }


    static setDate_end(travel: Travel, date_end: Date) {
        travel.date_end = new Date(date_end)
        travel.date_start = new Date(travel.date_end.getTime() - MS_IN_DAY * travel.days)
        Travel.setUpdated_at(travel)
    }

    static setDate_start(travel: Travel, date_start: Date) {
        travel.date_start = new Date(date_start)
        travel.date_end = new Date(travel.date_start.getTime() + MS_IN_DAY * travel.days)
        Travel.setUpdated_at(travel)
    }

    getMemberRole<T extends Member>(member: T) {
        if (this.isAdmin(member)) return 'admin'
        if (this.isEditor(member)) return 'editor'
        return 'commentator'
    }

    permitChange<T extends Member>(member: T) {
        return member.id === this.owner_id ||
            this.admins.includes(member.id) ||
            this.editors.includes(member.id)
    }

    permitWatch(member: Member) {
        if (this.permission.public) return true
        if (this.admins.includes(member.id)) return true
        if (this.editors.includes(member.id)) return true
        if (this.commentator.includes(member.id)) return true
        return false
    }

    isAdmin<T extends Member>(member: T) {
        if (member.id === this.owner_id) return true
        if (this.admins.includes(member.id)) return true
        return false
    }

    isEditor<T extends Member>(member: T) {
        return this.editors.includes(member.id);
    }

    permitDelete<T extends Member>(membeer: T) {
        return membeer.id === this.owner_id
    }

    hasPermit(user: Member, key: keyof TravelPermission) {
        if (this.permitChange(user)) return true
        return !!this.permission[key];
    }

    getPreference<T extends keyof TravelPreference>(key: T) {
        return this.preference[key]
    }

    permit<T extends keyof TravelPermission>(key: T) {
        return !!this.permission[key]
    }

    static setUpdated_at(travel: Travel) {
        travel.updated_at = new Date()
    }

    get isPublic() {
        return !!this.permission.public
    }

    static setDepth(travel: Travel, depth: TravelPreference['depth']) {
        travel.preference.depth = depth
        Travel.setUpdated_at(travel)
    }

    static setDensity(travel: Travel, density: TravelPreference['density']) {
        travel.preference.density = density
        Travel.setUpdated_at(travel)
    }

    static setPublic(travel: Travel, val: DBFlagType | boolean) {
        travel.permission.public = val ? 1 : 0
        Travel.setUpdated_at(travel)
    }

    isMember<T extends Member>(member: T) {
        if (member.id === this.owner_id) return true
        if (this.isAdmin(member)) return true
        if (this.isEditor(member)) return true
        if (this.members.includes(member.id)) return true
        return false
    }

    dto(): TravelType {
        return {
            id: this.id,
            code: this.code,
            description: this.description,
            direction: this.direction,
            owner_id: this.owner_id,
            photo: this.image?.id || this.photo,
            title: this.title,
            days: this.days,
            isFromPoint: this.isFromPoint,
            children_count: this.children_count,
            members_count: this.members_count,
            created_at: this.created_at,
            date_end: this.date_end,
            date_start: this.date_start,
            movementTypes: this.movementTypes,
            places: this.places.map(p => p.dto()),
            road: this.road.map(r => r.dto()),
            preference: this.preference.dto(),
            waypoints: this.waypoints.map(w => w.dto()),
            updated_at: this.updated_at,
            admins: this.admins,
            editors: this.editors,
            commentator: this.commentator,
            permission: this.permission.dto(),
            interests: this.interests,
        }
    }
}



