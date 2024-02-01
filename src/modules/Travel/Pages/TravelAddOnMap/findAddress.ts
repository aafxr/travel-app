import {WaypointType} from "../../../../types/WaypointType";
import {findByAddress} from "../../../../components/YandexMap";

export async function findAddress(wp: WaypointType) {
    const waypoint: WaypointType = {...wp}
    try {
        const response = await findByAddress(wp.address)
        if ('address' in response) {
            // const waypoint = newState.travel.waypoints[idx]
            waypoint.address = response.address
            waypoint.coords = response.boundedBy[0]
            return waypoint
        }
    } catch (e) {}
}