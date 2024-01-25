import {defaultTravel} from "../../../../../redux/travelStore/travelSlice";

export function transform_travel_v28(noModifiedTravel) {
    const def = {}
    Object.keys(defaultTravel).forEach(key => def[key] = defaultTravel[key]())
    /**@type{TravelType}*/
    const travel = {...def, ...noModifiedTravel}
    console.log('before ' ,travel)
    travel.places.map((p, idx) => {
        if (p.date_start) p.time_start = p.date_start
        if (p.date_end) p.time_end = p.date_end
        delete p.date_start
        delete p.date_end

        return p
    })
    console.log(travel)
    return travel
}