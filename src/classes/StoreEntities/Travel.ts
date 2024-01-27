import {nanoid} from "nanoid";
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


type TravelPropsType = Partial<TravelType> | Travel

export class Travel extends StoreEntity implements Omit<TravelType, 'photo'> {

    id = nanoid(8);
    code = '';
    description = '';
    direction = '';
    owner_id = '';
    title = '';

    private photo: string | Blob = '';
    imageURL = ''

    days = 1
    isFromPoint: DBFlagType = 0
    children_count = 0
    members_count = 1
    members: string[] = []

    created_at = new Date();
    date_end = new Date(0);
    date_start = new Date(0);

    movementTypes: MovementType[] = [MovementType.CAR];
    updated_at = new Date();
    places: Place[] = [];
    waypoints: Waypoint[] = [];

    admins: string[] = [];
    editors: string[] = [];
    commentator: string[] = [];

    preference = new Preference();
    permission: Permission = new Permission();

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
        if (travel.members) this.members = travel.members
        if (travel.movementTypes) this.movementTypes = (travel.movementTypes as any).map((mt: any) => (mt['id'] ? mt['id'] : mt) as MovementType)
        if (travel instanceof Travel)
            this.setPhoto(travel.imageURL || '')
        else if (travel.photo) {
            this.setPhoto(travel.photo)
        }
        if (travel.places) this.places = travel.places.map(p => new Place(p))
        if (travel.waypoints) this.waypoints = travel.waypoints.map(w => new Waypoint(w))

        if (travel.created_at) this.created_at = new Date(travel.created_at)
        if (travel.date_start) this.date_start = new Date(travel.date_start)
        if (travel.date_end) this.date_end = new Date(travel.date_end)
        if (travel.updated_at) this.updated_at = new Date(travel.updated_at)

        if (travel.admins) this.admins = travel.admins
        if (travel.editors) this.editors = travel.editors
        if (travel.commentator) this.commentator = travel.commentator

        if (travel.preference) this.preference = new Preference(travel.preference)
        if (travel.permission) this.permission = new Permission(travel.permission)
    }


    setId(id: string) {
        this.id = id
        this.setUpdated_at()
    }

    setCode(code: string) {
        this.code = code
        this.setUpdated_at()
    }

    setDescription(description: string) {
        this.description = description
        this.setUpdated_at()
    }

    setDirection(direction: string) {
        this.direction = direction
        this.setUpdated_at()
    }

    setOwner_id(owner_id: string) {
        this.owner_id = owner_id
        this.setUpdated_at()
    }

    setMembers(members: string[]) {
        this.members = members
        this.setUpdated_at()
    }

    setMovementTypes(movementTypes: MovementType[]) {
        this.movementTypes = movementTypes
        this.setUpdated_at()
    }

    setPlaces(places: Place[]) {
        this.places = places
        this.setUpdated_at()
    }

    removePlace(place: Place) {
        this.places = this.places.filter(p => p !== place)
        this.setUpdated_at()
    }

    setPhoto(photo: string | Blob) {
        if (this.imageURL && this.photo instanceof Blob) URL.revokeObjectURL(this.imageURL)

        this.photo = photo
        if (photo instanceof Blob)
            this.imageURL = URL.createObjectURL(photo)
        else {
            this.imageURL = photo
        }

        this.setUpdated_at()
    }

    setTitle(title: string) {
        this.title = title
        this.setUpdated_at()
    }

    setDays(days: number) {
        this.days = days
        this.setUpdated_at()
    }

    setIsFromPoint(isFromPoint: DBFlagType) {
        this.isFromPoint = isFromPoint
        this.setUpdated_at()
    }

    setChildren_count(children_count: number) {
        this.children_count = children_count
        this.setUpdated_at()
    }

    setMembers_count(members_count: number) {
        this.members_count = members_count
        this.setUpdated_at()
    }


    setDate_end(date_end: Date) {
        this.date_end = new Date(date_end.setHours(23, 59, 59, 999))
        this.setUpdated_at()
    }

    setDate_start(date_start: Date) {
        this.date_start = new Date(date_start.setHours(0, 0, 0, 0))
        this.setUpdated_at()
    }

    get people() {
        const list: string[] = []
        if (this.owner_id) list.push(this.owner_id)
        if (this.members.length) list.push(...this.members)
        return list
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

    private setUpdated_at() {
        this.updated_at = new Date()
        this.emit('update', [this])
    }

    get isPublic() {
        return !!this.permission.public
    }

    setDepth(depth: TravelPreference['depth']) {
        this.preference.depth = depth
        this.setUpdated_at()
    }

    setDensity(density: TravelPreference['density']) {
        this.preference.density = density
        this.setUpdated_at()
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
            members: this.members,
            created_at: this.created_at,
            date_end: this.date_end,
            date_start: this.date_start,
            movementTypes: this.movementTypes,
            places: this.places.map(p => p.dto()),
            preference: this.preference.dto(),
            waypoints: this.waypoints.map(w => w.dto()),
            updated_at: this.updated_at,
            admins: this.admins,
            editors: this.editors,
            commentator: this.commentator,
            permission: this.permission.dto(),
        }
    }
}



