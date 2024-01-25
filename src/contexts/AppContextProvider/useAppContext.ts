import {useContext} from "react";
import {AppContext} from "./AppContextProvider";

export function useAppContext(){
    return useContext(AppContext).context
}