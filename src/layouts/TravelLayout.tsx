import React, {PropsWithChildren, useEffect, useState} from "react";
import {Outlet, useNavigate, useParams} from "react-router-dom";

import defaultHandleError from "../utils/error-handlers/defaultHandleError";
import PageContainer from "../components/PageContainer/PageContainer";
import {useAppContext} from "../contexts/AppContextProvider";
import {TravelService} from "../classes/services";
import Loader from "../components/Loader/Loader";
import {useSocket} from "../contexts/SocketContextProvider";
import {StoreName} from "../types/StoreName";
import {DB} from "../classes/db/DB";
import {Travel} from "../classes/StoreEntities";


/**
 * компонент предназначен для предварительной загрузки  Travel
 * @function
 * @name TravelLayout
 * @returns {JSX.Element}
 * @category Components
 */
export default function TravelLayout({children}: PropsWithChildren) {
    const context = useAppContext()
    const {user, travel} = context
    const socket = useSocket()

    const {travelCode} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (user && travelCode && (!travel || travel.id !== travelCode)) {
            setLoading(true)
            TravelService.getById(travelCode)
                .then(travel => travel && context.setTravel(travel))
                .catch(defaultHandleError)
                .finally(() => setLoading(false))
        }
    }, [travelCode, user])


    useEffect(() => {
        if(!socket) return
        DB.getAll<Travel>(StoreName.TRAVEL)
            .then(travels => {
                const ids = travels.map(t => t.id)
                socket.emit('travel:join',{travelID: ids})
            })
    }, [socket])


    if (loading) {
        return (
            <PageContainer center>
                <Loader className='loader'/>
            </PageContainer>
        )
    } else if (!travel) {
        return (
            <PageContainer center>
                <div className='column center gap-1'>
                    <h2>Во время загрузки данных о путешествии произошла ошибка</h2>
                    <div className={'link'} onClick={() => navigate('/')}>На главную страницу</div>
                </div>
            </PageContainer>
        )
    } else {
        return <Outlet/>
    }

}