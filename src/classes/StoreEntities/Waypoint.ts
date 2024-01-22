import {WaypointType} from "../../types/WaypointType";
import {CoordinatesType} from "../../types/CoordinatesType";
import {nanoid} from "nanoid";
import {WithDTOMethod} from "../../types/WithDTOMethod";

export class Waypoint implements WaypointType, WithDTOMethod {
    address = '';
    id = nanoid(6);
    locality = '';
    coords: CoordinatesType = [-1, -1];

    constructor(waypoint: Partial<Waypoint | WaypointType>) {
        if (waypoint.address) this.address = waypoint.address
        if (waypoint.id) this.id = waypoint.id
        if (waypoint.locality) this.locality = waypoint.locality
        if (waypoint.coords) this.coords = waypoint.coords
    }

    setAddress(address: string) {
        this.address = address
    }

    setLocality(locality: string) {
        this.locality = locality
    }

    setCoords(coords: CoordinatesType) {
        this.coords = coords
    }

    dto():WaypointType{
        return {
            id: this.id,
            address: this.address,
            locality: this.locality,
            coords: this.coords,
        }
    }

}