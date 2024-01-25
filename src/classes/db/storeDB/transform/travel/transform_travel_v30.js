/**
 * @param {TravelType} travel
 * @return {TravelType}
 */
export function transform_travel_v30(travel){
    travel.created_at = new  Date(travel.created_at)
    travel.updated_at = new  Date(travel.updated_at)
    travel.date_start = new  Date(travel.date_start)
    travel.date_end = new  Date(travel.date_end)

    if(travel.hotels) {
        delete travel.hotels
    }
    return travel
}