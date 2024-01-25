import {useTravel} from "../contexts/AppContextProvider";

/**
 * хук возвращает travel-контекст
 * @function
 * @name useTravelContext
 * @returns {{update: function(): void, travel: Travel, travelObj: TravelType | null}}
 * @category Hooks
 */
export default function useTravelContext() {
    return useTravel()!
    // const state = useContext(TravelContext)
    // return {travel: state.travel!}
}