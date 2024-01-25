import React, {createContext, useEffect, useState} from "react";
import {Outlet, useNavigate, useParams} from "react-router-dom";

import defaultHandleError from "../utils/error-handlers/defaultHandleError";
import PageContainer from "../components/PageContainer/PageContainer";
import useUserSelector from "../hooks/useUserSelector";
import {Travel, User} from "../classes/StoreEntities";
import Loader from "../components/Loader/Loader";
import {StoreName} from "../types/StoreName";
import {DB} from "../classes/db/DB";
import {USER_AUTH} from "../static/constants";

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
    return <Outlet/>
    // const [state, setState] = useState(defaultTravel)
    // const [unsubscribe, setUnsubscribe] = useState<{ unsub: null | Function }>({unsub: null})
    // const user = useUserSelector()
    // const {travelCode} = useParams()
    // const navigate = useNavigate()
    //
    //
    // const subscribeOnUserChanges = (travel: Travel) => {
    //     if (!travel) return null
    //     if (unsubscribe.unsub) unsubscribe.unsub()
    //     return travel.subscribe('update', function (this: Travel, travel: Travel) {
    //         if (user)
    //             DB.update(this, user, undefined, defaultHandleError)
    //         localStorage.setItem(USER_AUTH, JSON.stringify(this.dto()))
    //         setState({...state, travel: this})
    //     }.bind(travel))
    // }
    //
    //
    // useEffect(() => {
    //     if (user && travelCode && (!state.travel || state.travel.id !== travelCode)) {
    //         setState({...state, loading: true})
    //         DB.getOne<Travel>(StoreName.TRAVEL, travelCode, (travel) => {
    //             const newState = {...state, loading: false}
    //             if (travel) {
    //                 travel = new Travel(travel)
    //                 setUnsubscribe({unsub:subscribeOnUserChanges(travel)})
    //                 newState.travel = travel
    //             }
    //             setState(newState)
    //         })
    //     }
    //     return () => {
    //         if (unsubscribe.unsub) unsubscribe.unsub()
    //     }
    // }, [travelCode, user])
    //
    //
    // if (state.loading) {
    //     return (
    //         <PageContainer center>
    //             <Loader className='loader'/>
    //         </PageContainer>
    //     )
    // } else if (!state.travel) {
    //     return (
    //         <PageContainer center>
    //             <div className='column center gap-1'>
    //                 <h2>Во время загрузки данных о путешествии произошла ошибка</h2>
    //                 <div className={'link'} onClick={() => navigate('/')}>На главную страницу</div>
    //             </div>
    //         </PageContainer>
    //     )
    // } else {
    //     return (
    //         <TravelContext.Provider value={state}>
    //             <Outlet/>
    //         </TravelContext.Provider>
    //     )
    // }

}