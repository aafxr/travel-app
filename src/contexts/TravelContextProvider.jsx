import React, {createContext, useEffect, useState} from "react";
import {Outlet, useNavigate, useParams} from "react-router-dom";

import PageContainer from "../components/Loading/PageContainer";
import Loader from "../components/Loader/Loader";
import storeDB from "../db/storeDB/storeDB";
import constants from "../static/constants";
import Travel from "../classes/Travel";
import useUpdate from "../hooks/useUpdate";
import useUserSelector from "../hooks/useUserSelector";
import {Travel2} from "../classes/Travel2";

/**
 * @name TravelContextType
 * @typedef {Object} TravelContextType
 * @property {Travel | null} travel instance класса Travel
 * @property {TravelType | null}  travelObj
 * @category Types
 */


/**@type {TravelContextType}*/
const defaultTravel = {
    travel: null,
    travelObj: null
}

/**
 * @type {React.Context<TravelContextType>}
 */
export const TravelContext = createContext(defaultTravel)

/**
 * Контекст предоставляет экземпляр Travel
 * @function
 * @name TravelContextProvider
 * @returns {JSX.Element}
 * @category Components
 */
export default function TravelContextProvider() {
    const [loading, setLoading] = useState(true)
    const [state, setState] = useState(/**@type{TravelContextType}*/defaultTravel)
    const user = useUserSelector()
    const update = useUpdate()
    const {travelCode} = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        if (user && travelCode && (!state.travel || state.travel.id !== travelCode)) {
            setLoading(true)
            storeDB.onReadySubscribe(() => {
                storeDB
                    .getOne(constants.store.TRAVEL, travelCode)
                    .then(item => {
                        setLoading(false)
                        const t = item
                            ?  new Travel(item, travelCode)
                            :  new Travel(undefined, travelCode)
                        t?.setUser(user.id)
                        if (t) {
                            t.onUpdate(() => setState(prev => ({...prev, travelObj: Object.freeze(t.object)})))
                            setState({travel: t, travelObj: Object.freeze(t.object)})
                        }
                    })
            })
        }
        return () => {
            if (state.travel) state.travel.offUpdate(update)
        }
    }, [travelCode, user])


    if (state.travel) {
        window.travel = state.travel
    }
    if (state.travel && loading) {
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