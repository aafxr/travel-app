import createId from "./createId";

/**
 * Функция возвращает дефольные данные встречи
 * @returns {AppointmentType}
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