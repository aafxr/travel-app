import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";

import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";
import PageContainer from "../../../../components/PageContainer/PageContainer";
import TravelCard from "../../../Travel/components/TravelCard/TravelCard";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import useUserSelector from "../../../../hooks/useUserSelector";
import {fetchTravels} from "../../../../api/fetch/fetchTravels";
import Loader from "../../../../components/Loader/Loader";
import {PageHeader, Tab} from "../../../../components/ui";
import {Travel} from "../../../../classes/StoreEntities";
import {StoreName} from "../../../../types/StoreName";
import {DB} from "../../../../db/DB";

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
    const navigate = useNavigate()
    const {travelsType} = useParams()
    const [travels, setTravels] = useState<Array<Travel>>([])
    const user = useUserSelector()
    /** список отфильтрованных путешествий в соответствии с выбранным табом */
    const [actualTravels, setActualTravels] = useState<Array<Travel>>([])

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const ifNotFetchGetFromDB = () => {
            DB.getAll<Travel>(StoreName.TRAVEL, list => {
                const travelsList = list.map(t => new Travel(t))
                console.log(travelsList)
                setTravels(travelsList)
                setLoading(false)
            }, () => setLoading(false))
        }

        if (user) {
            fetchTravels()
                .then(list => {
                    if (list.length) {
                        setTravels(list)
                        setLoading(false)
                    } else {
                        ifNotFetchGetFromDB()
                    }
                })
                .catch(ifNotFetchGetFromDB)
        }
    }, [user])

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
            DB.delete(travel, user, () => {
                pushAlertMessage({type: "success", message: `${travel.title} удалено.`})
                setTravels(travels.filter(t => t.id !== travel.id))
            }, (e) => {
                defaultHandleError(e, 'Не удалось удалить путешествие')
            })
        }
    }

    if (loading)
        return (
            <PageContainer center>
                <Loader style={{width: 40, height: 40}}/>
            </PageContainer>
        )

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
            <Container className='overflow-x-hidden content pt-20 pb-20'>
                {
                    user
                        ? (
                            <ul className='column gap-1'>
                                {
                                    !!actualTravels.length && actualTravels.map(t => (
                                        <li key={t.id}>
                                            <TravelCard
                                                travel={t}
                                                onRemove={() => handleRemove(t)}
                                            />
                                        </li>
                                    ))
                                }
                            </ul>
                        ) : (
                            <IconButton
                                border={false}
                                title='Авторизоваться'
                                className='link'
                                onClick={() => navigate('/login/')}
                            />
                        )
                }
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