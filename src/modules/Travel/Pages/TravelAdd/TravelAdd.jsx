import React, { useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";

import createTravel from "../../helpers/createTravel";
import travelDB from "../../../../db/travelDB/travelDB";
import createAction from "../../../../utils/createAction";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import constants from "../../../../static/constants";

import '../../css/Travel.css'
import {actions} from "../../../../redux/store";

export default function TravelAdd() {
    const navigate = useNavigate()
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()

    const [title, setTitle] = useState('')


    async function handler() {
        if (!user) {
            pushAlertMessage({type: "danger", message: "Необходимо авторизоваться"})
            return
        }
        if (!title.length) {
            pushAlertMessage({type: "danger", message: "Необходимо указать название маршрута"})
            return
        }
        if (title.length && user && user.id) {
            const user_id = user.id
            const data = createTravel(title, user_id)
            const action = createAction(constants.store.TRAVEL, user_id, 'add', data)

            await travelDB.editElement(constants.store.TRAVEL, data)
            await travelDB.editElement(constants.store.TRAVEL_ACTIONS, action)

            dispatch(actions.travelActions.addTravels(data))
            navigate('/travels/current/')
        }
    }


    return (
        <>
            <div className='travel wrapper'>
                <Container className='content hide-scroll'>
                    <PageHeader arrowBack className='travel-destination'>
                        <div className='w-full'>
                            <Input
                                className='travel-destination-input'
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder='Куда едем?'
                            />
                        </div>
                    </PageHeader>
                    <div className='column gap-1'>
                        <Link className='travel-link' to={'/travel/add/map/'}>
                            <div className='icon'>
                                <img className={'img-abs'} src={process.env.PUBLIC_URL + '/icons/map.svg'} alt="map"/>
                            </div>
                            Указать на карте
                        </Link>
                    </div>
                </Container>
                <div className='footer-btn-container footer'>
                    <Button onClick={handler} disabled={!title}>Продолжить</Button>
                </div>
            </div>
        </>
    )
}
