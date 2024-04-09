import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import {useAppContext, useUser} from "../../../../contexts/AppContextProvider";
import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import {TravelService} from "../../../../classes/services";
import {PageHeader, Tab} from "../../../../components/ui";
import {Travel} from "../../../../classes/StoreEntities";
import {ShowTravelsList} from "./ShowTravelsList";

/**
 * @typedef {'old' | 'current' | 'plan'} TravelDateStatus
 */

/**
 * компонент отображает  маршруты, отсортированные по времени (прошлыые, текущие, будущие)
 * @function
 * @name TravelRoutes
 * @returns {JSX.Element}
 * @category Pages
 */
export default function TravelRoutes() {
    const user = useUser()
    const context = useAppContext()

    const {travelsType} = useParams()
    const navigate = useNavigate()
    const [travels, setTravels] = useState<Travel[]>([])
    /** список отфильтрованных путешествий в соответствии с выбранным табом */
    const [actualTravels, setActualTravels] = useState<Array<Travel>>([])

    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (user) {
            TravelService.getList()
                .then(setTravels)
                .catch(console.error)
                .finally(() => setLoading(false))
        }
    }, [])


    /** обновление списка актуальных путешествий */
    useEffect(() => {
        if (travels && travelsType) {
            const filteredTravels = travels.filter(t => getTravelDateStatus(t) === travelsType)
            setActualTravels(filteredTravels)
        }
    }, [travels, travelsType])


    /** обработка удаления путешествия */
    function handleRemove(travel: Travel) {
        if (user) {
            /** удаление путешествия из бд и добавление экшена об удалении */
            TravelService.delete(context, travel, user)
                .then(() => setTravels(travels.filter(t => t !== travel)))
                .catch(defaultHandleError)
        }
    }


    const handleNewTrip = () => navigate(`/travel/add/`)


    return (
        <div className='wrapper'>
            <Container>
                <PageHeader title={'Маршруты'}/>
            </Container>
            <div className='flex-stretch'>
                <Tab name={'Прошедшие'} to={'/travels/old/'}/>
                <Tab name={'Текущие'} to={'/travels/current/'}/>
                <Tab name={'Будущие'} to={'/travels/plan/'}/>
            </div>
            <Container className='overflow-x-hidden content pt-20 pb-20' loading={loading}>
                {!travels.length && <div className='link' onClick={handleNewTrip}>Запланировать поездку</div>}
                <ShowTravelsList travels={actualTravels} onRemove={handleRemove}/>
            </Container>
            <Navigation className='footer'/>
        </div>
    )
}


/**
 * функция определяет временной статус путешествия (прошлыые, текущие, будущие)
 */
function getTravelDateStatus(travel: Travel) {
    if (!travel) return "old"
    const now = new Date()

    if (travel.date_end < now) {
        return "old"
    } else if (travel.date_start > now) {
        return "plan"
    }
    return "current"
}