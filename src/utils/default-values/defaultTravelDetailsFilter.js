import {DEFAULT_TRAVEL_DETAILS_FILTER} from "../../static/constants";

/**
 * @returns {TravelDetailsFilterType}
 */
export default function defaultTravelDetailsFilter(){
    if(!localStorage[DEFAULT_TRAVEL_DETAILS_FILTER]) {
        /**@type{TravelDetailsFilterType}*/
        const dtdf = 'byDays'
        localStorage.setItem(DEFAULT_TRAVEL_DETAILS_FILTER, dtdf)
    }
    return localStorage[DEFAULT_TRAVEL_DETAILS_FILTER]
}