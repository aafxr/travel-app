import {useContext} from "react";
import {YMapContext} from "./YandexMapContainer";

export default function useYMap(){
    return useContext(YMapContext).map
}
