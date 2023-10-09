import createId from "./createId";

/**
 * Функция возвращает дефольные данные встречи
 * @returns {AppointmentType}
 * @function
 * @name defaultAppointmentData
 * @category Utils
 */
export default function defaultAppointmentData(){
    return {
        id: createId(),
        title: '',
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        description: '',
    }
}