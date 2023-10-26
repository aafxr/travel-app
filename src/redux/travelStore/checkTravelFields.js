import {defaultMovementTags} from "../../static/constants";

/**@type{TravelType} */
const defaultTravel = {
    id: () => '',
    title: () => '',
    code: () => '',
    owner_id: () => '',
    photo: () => '',

    date_start: () => new Date().toISOString(),
    date_end: () => new Date().toISOString(),

    created_at: () => new Date().toISOString(),
    updated_at: () => new Date().toISOString(),

    hotels: () => [],
    members: () => [],
    appointments: () => [],
    movementTypes: () => [{id: defaultMovementTags[0].id, title: defaultMovementTags[0].title}],

    direction: () => '',
    childs_count: () => 0,
    adults_count: () => 1,
    waypoints: () => [],
    isPublic: () => 0,
}

/**
 * дописываем недастоющие поля в travel
 * @param {TravelType | TravelType} travels
 * @returns {TravelType | TravelType[] | null | undefined}
 */
export default function checkTravelFields(travels) {
    if (Array.isArray(travels)) {
        travels.forEach(t => addMissingFields(t))
        return travels
    } else if (typeof travels === 'object') {
        addMissingFields(travels)
        return travels
    } else if (travels === null || travels === undefined) {
        return travels
    } else {
        const err = new Error("Typeof travel  = " + typeof travels)
        console.warn(err)
    }

}

function addMissingFields(travel) {
    Object.keys(defaultTravel).forEach(key => {
        if (!travel[key]) travel[key] = defaultTravel[key]()
    })
}