import {fetchPlaces} from "../../api/fetch/fetchPlaces";
import {fetchPlaceByID} from "../../api/fetch";

/**
 * Сервис для загрузки мест
 */
export class PlaceService{
    /**
     * поиск мест по текстовому совпадению
     * @param text
     */
    static async searchByText(text: string){
        return await fetchPlaces(text)
    }


    /**
     * поиск места по id места
     * @param placeID
     */
    static async searchByID(placeID: string){
        return await fetchPlaceByID(placeID)
    }
}