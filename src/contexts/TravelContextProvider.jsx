import React, {createContext, useEffect, useState} from "react";
import {Outlet, useNavigate, useParams} from "react-router-dom";

import PageContainer from "../components/Loading/PageContainer";
import Loader from "../components/Loader/Loader";
import storeDB from "../db/storeDB/storeDB";
import constants from "../static/constants";
import Travel from "../classes/Travel";
import useUpdate from "../hooks/useUpdate";
import useUserSelector from "../hooks/useUserSelector";

/**
 * @name TravelContextType
 * @typedef {Object} TravelContextType
 * @property {Travel | null} travel instance класса Travel
 * @category Types
 */


/**@type {TravelContextType}*/
const defaultTravel = {
    travel: null
}

/**
 * @type {React.Context<{travel: (Travel|null)}>}
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
    const [state, setState] = useState(defaultTravel)
    const {user} = useUserSelector()
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
                            ?  new Travel(item)
                            :  null
                        t.setUser(user.id)
                        if (t) t.onUpdate(update)
                        setState({travel: t})
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
    if (loading) {
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