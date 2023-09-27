import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import defaultAppointmentData from "../../../../utils/defaultAppointmentData";
import {TextArea} from "../../../../components/ui/TextArea/TextArea";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import createAction from "../../../../utils/createAction";
import constants from "../../../../static/constants";
import useTravel from "../../hooks/useTravel";
import storeDB from "../../../../db/storeDB/storeDB";
import ErrorReport from "../../../../controllers/ErrorReport";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import {actions} from "../../../../redux/store";


export default function TravelAddAppointment() {
    const {travelCode, appointmentCode} = useParams()
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const dateHandlers = useChangeInputType('date')
    // const timeHandlers = useChangeInputType('time')

    const travel = useTravel(travelCode)
    const [appointment, setAppointment] = useState(null)

    //==================================================================================================================
    /** поиск встречи */
    useEffect(() => {
        if (travel && !appointment) {
            const apidx = travel?.appointments.findIndex(a => a.id === appointmentCode)
            if (apidx !== -1) setAppointment(travel.appointments[apidx])
            else setAppointment(defaultAppointmentData())
        }
    }, [travelCode, appointmentCode, travel])

    //==================================================================================================================
    function handleAppointmentChanges(e, key) {

        console.log(new Date(e.target.value))

        if (key in appointment) {
            const newAppointment = {...appointment}

            if (key === 'date') newAppointment[key] = e.target.value
            else if(key === 'time') newAppointment[key] = e.target.value
            else newAppointment[key] = e.target.value

            setAppointment(newAppointment)
        }
    }

    //==================================================================================================================
    function handleSave() {
        const newTravel = {...travel}
        if (!newTravel.appointments) newTravel.appointments = []

        const apidx = newTravel?.appointments.findIndex(a => a.id === appointmentCode)

        newTravel.appointments = [...newTravel.appointments]

        if (appointmentCode && apidx !== -1)  newTravel.appointments[apidx] = appointment
        else newTravel.appointments.push(appointment)

        const action = createAction(constants.store.TRAVEL, user.id, 'update', newTravel)
        Promise.all([
            storeDB.editElement(constants.store.TRAVEL, newTravel),
            storeDB.editElement(constants.store.TRAVEL_ACTIONS, action)
        ])
            .then(() => navigate(-1))
            .then(() => dispatch(actions.travelActions.addAppointment(appointment)))
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
                                            value={appointment.date}
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
