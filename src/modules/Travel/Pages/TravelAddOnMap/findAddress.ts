import {findByAddress} from "../../../../components/YandexMap";
import {Waypoint} from "../../../../classes/StoreEntities";

export async function findAddress(wp: Waypoint) {
    const waypoint: Waypoint = new Waypoint(wp)
    try {
        const response = await findByAddress(wp.address)
        if ('address' in response) {
            // const waypoint = newState.travel.waypoints[idx]
            waypoint.address = response.address
            waypoint.coords = response.boundedBy[0]
            waypoint.locality = response.description
            return waypoint
        }
    } catch (e) {}
}