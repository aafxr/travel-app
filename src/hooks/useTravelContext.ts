import {useContext} from "react";
import {TravelContext} from "../contexts/TravelContextProvider";

/**
 * хук возвращает travel-контекст
 * @function
 * @name useTravelContext
 * @returns {{update: function(): void, travel: Travel, travelObj: TravelType | null}}
 * @category Hooks
 */
export default function useTravelContext() {
    const state = useContext(TravelContext)
    return {travel: state.travel!}
}