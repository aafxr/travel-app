import createId from "./createId";

/** Утилита генерирует новые данные об отеле
 * @param {string} [hotel_id]
 * @returns {HotelType}
 */
export default function defaultHotelData(hotel_id) {
    return {
        id: hotel_id || createId(),
        title: '',
        location: '',
        check_in: new Date().toISOString(),
        check_out: new Date().toISOString()
    }
}