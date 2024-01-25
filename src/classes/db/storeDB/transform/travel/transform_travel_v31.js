/**
 * @param {TravelType} travel
 * @return {TravelType}
 */
export function transform_travel_v31(travel){
    travel.appointments = travel.appointments.map(ap => {
        ap.date = new Date(ap.date)
        return ap
    })

    travel.places = travel.places.map(pl => {
        pl.time_start = new Date(pl.time_start)
        pl.time_end = new Date(pl.time_end)
        return pl
    })
    return travel
}