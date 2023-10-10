import React, { useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import createAction from "../../../../utils/createAction";
import MapIcon from "../../../../components/svg/MapIcon";
import createTravel from "../../helpers/createTravel";
import storeDB from "../../../../db/storeDB/storeDB";
import constants from "../../../../static/constants";
import {actions} from "../../../../redux/store";

import '../../css/Travel.css'

/**
 * @name TravelAdd
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAdd() {
    const navigate = useNavigate()
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()

    const [title, setTitle] = useState('')

    /** обработчик добавления нового маршрута */
    async function handleAddRoute() {
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

            await storeDB.editElement(constants.store.TRAVEL, data)
            await storeDB.editElement(constants.store.TRAVEL_ACTIONS, action)

            dispatch(actions.travelActions.addTravel(data))
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
                                <MapIcon/>
                            </div>
                            Указать на карте
                        </Link>
                    </div>
                </Container>
                <div className='footer-btn-container footer'>
                    <Button onClick={handleAddRoute} disabled={!title}>Продолжить</Button>
                </div>
            </div>
        </>
    )
}
