import {DBFlagType} from "../../types/DBFlagType";
import {PlaceKind} from "../../types/PlaceKindType";
import {PlaceType} from "../../types/PlaceType";
import {nanoid} from "nanoid";
import {CoordinatesType} from "../../types/CoordinatesType";
import {WithDTOMethod} from "../../types/WithDTOMethod";

/**
 * представление места маршрута
 * @class
 * @name Place
 * @extends Entity
 *
 */
export class Place implements PlaceType, WithDTOMethod {
    _id = nanoid(6);
    id = '';
    name = '';
    formatted_address = '';
    type: PlaceKind = PlaceKind.place;
    day?: number;
    photos: string[] = []
    location: CoordinatesType = [-1, -1];
    time_start: Date = new Date(0);
    time_end: Date = new Date(0);
    visited: DBFlagType = 0;

    constructor(place: Partial<Place | PlaceType>) {
        if (place._id) this._id = place._id
        if (place.id) this.id = place.id
        if (place.formatted_address) this.formatted_address = place.formatted_address
        if (place.name) this.name = place.name
        if (place.type) this.type = place.type
        if (place.day) this.day = place.day
        if (place.photos) this.photos = place.photos
        if (place.location) this.location = place.location
        if (place.visited) this.visited = place.visited

        if (place.time_start) this.time_start = place.time_start
        if (place.time_end) this.time_end = place.time_end
    }

    setId(id: string) {
        this.id = id
    }

    setName(name: string) {
        this.name = name
    }

    setFormatted_address(formatted_address: string) {
        this.formatted_address = formatted_address
    }

    setType(type: PlaceKind) {
        this.type = type
    }

    setday(day: number) {
        this.day = day
    }

    setLocation(location: CoordinatesType) {
        this.location = location
    }


    setTime_start(time_start: Date) {
        this.time_start = new Date(time_start)
    }

    setTime_end(time_end: Date) {
        this.time_end = new Date(time_end)
    }

    setVisited(visited: DBFlagType) {
        this.visited = visited
    }

    dto():PlaceType{
        return{
            _id: this._id,
            id: this.id,
            name: this.name,
            formatted_address: this.formatted_address,
            type: this.type,
            day: this.day,
            location: this.location,
            time_start: this.time_start,
            time_end: this.time_end,
            visited: this.visited,
            photos: this.photos,
        }
    }


}