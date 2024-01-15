import constants from "../static/constants";

/**
 * хук достает из стейта travelState
 * @name useTravelStateSelector
 * @returns {TravelState}
 * @category Hooks
 */
export default function useTravelStateSelector(){
    return useSelector(state => state[constants.redux.TRAVEL])
}