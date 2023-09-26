import createId from "./createId";

export default function defaultAppointmentData(){
    return {
        id: createId(),
        title: '',
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        description: ''
    }
}