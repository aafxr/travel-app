import {useContext} from "react";
import {YMapContext} from "./YandexMapContainer";

export function useYMap(){
    return useContext(YMapContext).map
}
