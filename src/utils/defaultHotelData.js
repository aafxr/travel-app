import createId from "./createId";

/** Утилита генерирует новые данные об отеле
 * @returns {HotelType}
 */
export default function defaultHotelData() {
    return {
        id: createId(),
        title: '',
        location: '',
        check_in: new Date().toLocaleDateString(),
        check_out: new Date().toLocaleDateString()
    }
}