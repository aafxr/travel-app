import {useContext} from "react";
import {TravelContext} from "../contexts/TravelContextProvider";
import useUpdate from "./useUpdate";

/**
 * хук возвращает travel-контекст
 * @function
 * @name useTravelContext
 * @returns {{update: function(): void, travel: Travel}}
 * @category Hooks
 */
export default function useTravelContext(){
    const state = useContext(TravelContext)
    const update = useUpdate()
    return {travel: state.travel, update}
}