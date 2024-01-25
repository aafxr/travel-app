import {useAppContext} from "./useAppContext";

export function useTravel(){
    return useAppContext().travel
}