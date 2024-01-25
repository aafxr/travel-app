import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import {TravelService} from "../../../../classes/services";
import {Travel} from "../../../../classes/StoreEntities";
import {MapIcon} from "../../../../components/svg";

import '../../css/Travel.css'

/**
 * @name TravelAdd
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelAdd() {
    const navigate = useNavigate()
    const user = useUser()
    const context = useAppContext()

    const [title, setTitle] = useState('')

    /** обработчик добавления нового маршрута */
    async function handleAddRoute() {
        if (!title.length) {
            pushAlertMessage({type: "danger", message: "Необходимо указать название маршрута"})
            return
        }
        if (title.length && user) {
            const travel = new Travel({title, owner_id: user.id})
            console.log(travel)
            TravelService.create(context, travel)
                .then(() => navigate('/travels/current/'))
                .catch(defaultHandleError)

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
                                onChange={setTitle}
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
