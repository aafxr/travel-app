import createId from "./createId";

/**
 * Функция возвращает дефольные данные встречи
 * @returns {AppointmentType}
 * @function
 * @name defaultAppointmentData
 * @param {string} primary_entity_id
 * @category Utils
 */
export default function defaultAppointmentData(primary_entity_id){
    return {
        id: createId(primary_entity_id),
        title: '',
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        description: '',
    }
}