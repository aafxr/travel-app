import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import defaultAppointmentData from "../../../../utils/default-values/defaultAppointmentData";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import {useTravel} from "../../../../contexts/AppContextProvider";
import useUserSelector from "../../../../hooks/useUserSelector";
import ErrorReport from "../../../../controllers/ErrorReport";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import {Travel} from "../../../../classes/StoreEntities";
import {TextArea} from "../../../../components/ui";

/**
 * компонент для добавления встреч
 * @function
 * @name TravelAddAppointment
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAddAppointment() {
    const { appointmentCode} = useParams()
    const user = useUserSelector()
    // const dispatch = useDispatch()
    const navigate = useNavigate()
    // const dateHandlers = useChangeInputType('date')
    // const timeHandlers = useChangeInputType('time')

    const travel = useTravel()
    const [appointment, setAppointment] = useState(null)

    //==================================================================================================================
    /** поиск встречи (инициализация начального значения) */
    useEffect(() => {
        if (travel && !appointment) {
            /** индекс встречи в массиве встреч путешествия */
            const ap = Travel.appointments.find(a => a.id === appointmentCode)
            /** инициализация путешествия */
            if (ap) setAppointment(ap)
            else setAppointment(defaultAppointmentData())
        }
    }, [appointmentCode, travel])

    //==================================================================================================================
    /**
     * обработчик обновляет поле встречи с ключом "key"
     * @param {InputEvent} e
     * @param {keyof AppointmentType} key
     */
    function handleAppointmentChanges(e, key) {
        if (key in appointment) {
            /** клон встречи ( appointment immutable )  */
            const newAppointment = {...appointment}
            if (key === 'date') newAppointment[key] = e.target.value
            else if(key === 'time') newAppointment[key] = e.target.value
            else newAppointment[key] = e.target.value
            /** обновление состояния */
            setAppointment(newAppointment)
        }
    }

    //==================================================================================================================
    /** обработка сохранения данных о встрече */
    function handleSave() {
        travel
            .addAppointment(appointment)
            .save(user.id)
            .then(() => navigate(-1))
            .catch(err => {
                ErrorReport.sendError(err).catch(console.error)
                pushAlertMessage({type: "warning", message: "Не удалось добавить встречу"})
            })
    }


    return (
        <div className='wrapper'>
            <Container>
                <PageHeader arrowBack title='Добавить встречу'/>
            </Container>
            <Container className='content column gap-1'>
                {
                    !!appointment
                        ? (
                            <>
                                <div className='column gap-0.25'>
                                    <Input
                                        type='text'
                                        placeholder='Укажите место'
                                        value={appointment.title}
                                        onChange={(e) => handleAppointmentChanges(e, 'title')}
                                    />
                                    <div className='flex-stretch'>
                                        <Input
                                            className='br-right-0'
                                            type='date'
                                            placeholder='Дата'
                                            value={appointment.date ? appointment.date.split('T').shift() : ''}
                                            min={travel.date_start}
                                            onChange={(e) => handleAppointmentChanges(e, 'date')}
                                        />
                                        <Input
                                            className='br-left-0'
                                            type='time'
                                            value={appointment.time}
                                            placeholder='Время'
                                            step="60000"
                                            onChange={(e) => handleAppointmentChanges(e, 'time')}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div>Комментарий</div>
                                    <TextArea
                                        placeholder='Например, совещание'
                                        value={appointment.description}
                                        onChange={(e) => handleAppointmentChanges(e, 'description')}
                                    />
                                </div>
                            </>
                        )
                        : (<div>Загрузка информации о встрече</div>)
                }

            </Container>
            <div className='footer-btn-container footer'>
                <Button
                    onClick={handleSave}
                    disabled={!appointment || !appointment.title || !appointment.description || !appointment.date || !appointment.time}
                >Добавить</Button>
            </div>
        </div>
    )
}
