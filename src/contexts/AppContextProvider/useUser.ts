import {useAppContext} from "./useAppContext";

export function useUser(){
    return useAppContext().user
}