import React, {createContext, useEffect, useState} from "react";
import {Outlet, useNavigate, useParams} from "react-router-dom";

import PageContainer from "../components/PageContainer/PageContainer";
import useUserSelector from "../hooks/useUserSelector";
import {Place, Travel} from "../classes/StoreEntities";
import Loader from "../components/Loader/Loader";
import {DB} from "../db/DB";
import {StoreName} from "../types/StoreName";
import defaultHandleError from "../utils/error-handlers/defaultHandleError";

/**
 * @name TravelContextType
 * @typedef {Object}                TravelContextType
 * @property {Travel | null}        travel instance класса Travel
 * @property {TravelType | null}    travelObj
 * @category Types
 */

type TravelContextType = {
    travel: Travel | null
    loading: boolean
}


const defaultTravel: TravelContextType = {
    travel: null,
    loading: false
}


export const TravelContext = createContext<TravelContextType>(defaultTravel)

/**
 * Контекст предоставляет экземпляр Travel
 * @function
 * @name TravelContextProvider
 * @returns {JSX.Element}
 * @category Components
 */
export default function TravelContextProvider() {
    const [state, setState] = useState(defaultTravel)
    const [unsubscribe, setUnsubscribe] = useState<Function | null>(null)
    const user = useUserSelector()
    const {travelCode} = useParams()
    const navigate = useNavigate()

    window.DB = DB
    window.Travel = Travel
    window.Place = Place

    useEffect(() => {
        if (user && travelCode && (!state.travel || state.travel.id !== travelCode)) {
            setState({...state, loading: true})
            DB.getOne<Travel>(StoreName.TRAVEL, travelCode, (travel) => {
                const newState = {...state, loading: false}
                if (travel) {
                    travel = new Travel(travel)
                    const subscription = travel.subscribe('update', (travel) => {
                        DB.update(travel, user, undefined, defaultHandleError)
                        setState(prev => ({...prev, travel}))
                    })
                    setUnsubscribe(subscription)
                    newState.travel = travel
                }
                setState(newState)
            })
        }
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [travelCode, user])


    if (state.travel) {
        window.travel = state.travel
    }
    
    
    if (state.travel && state.loading) {
        return (
            <PageContainer center>
                <Loader className='loader'/>
            </PageContainer>
        )
    } else if (!state.travel) {
        return (
            <PageContainer center>
                <div className='column center gap-1'>
                    <h2>Во время загрузки данных о путешествии произошла ошибка</h2>
                    <div className={'link'} onClick={() => navigate('/')}>На главную страницу</div>
                </div>
            </PageContainer>
        )
    } else {
        return (
            <TravelContext.Provider value={state}>
                <Outlet/>
            </TravelContext.Provider>
        )
    }

}