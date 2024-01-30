import React, {useEffect, useState} from "react";

import SessionItem from "../../../../components/SessionItem/SessionItem";
import {REFRESH_TOKEN} from "../../../../static/constants";
import Container from "../../../../components/Container/Container";
import useUserSelector from "../../../../hooks/useUserSelector";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import Loader from "../../../../components/Loader/Loader";
import {PageHeader} from "../../../../components/ui";

import aFetch from "../../../../axios";

type ResponseSessionType = {
    ok: boolean
    data: SessionType[]
}

export type SessionType ={
    SessionDataType: string
    created_at: string
    created_ip: string
    created_location: string
    created_user_agent: string
    uid: string
    update_location: string
    updated_at: string
    updated_ip: string
    active: boolean
}


/**
 * @typedef {object}    SessionDataType
 * @property {string}   created_at
 * @property {string}   created_ip
 * @property {string}   created_location
 * @property {string}   created_user_agent
 * @property {string}   uid
 * @property {string}   update_location
 * @property {string}   updated_at
 * @property {string}   updated_ip
 * @property {boolean}  active
 */


/**
 * страница отображает активные сессии пользователя
 * @function
 * @name Sessions
 * @returns {JSX.Element}
 * @category Pages
 */
export default function Sessions() {
    const user = useUserSelector()

    const [currentSession, setCurrentSession] = useState<SessionType>()
    const [authList, setAuthList] = useState<SessionType[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (user) {
                    aFetch.post<ResponseSessionType>('/user/auth/getList/', {[REFRESH_TOKEN]: user.refresh_token || ''})
                        .then(res => res.data)
                        .then(({ok, data}) => {
                            console.log({ok, data})
                            if (ok) {
                                setCurrentSession(data.find(a => a.active) )
                                setAuthList(data.filter(a => !a.active).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))
                                setLoading(false)
                            }
                        })
                        .catch(console.error)
        }
    }, [user])


    function removeSessionHandler(auth:SessionType) {
        aFetch.post('/user/auth/remove/', {uid: auth.uid})
            .then((res) => {
                console.log(res)
                setAuthList(authList.filter(a => a.uid !== auth.uid))
            })
            .catch(console.error)
    }

    return (
        <Container className='wrapper'>
            <PageHeader arrowBack title='Активные сеансы'/>
            <div className='content'>
                {!!currentSession && <SessionItem className='bg-grey-light color-black' sessionData={currentSession}/>}
                {!!authList.length && authList.map(
                    /**@param{SessionDataType} a*/
                    a => (
                        <Swipe
                            key={a.uid}
                            className='auth-item'
                            onRemove={() => removeSessionHandler(a)}
                            rightButton
                        >
                            <SessionItem sessionData={a}/>
                        </Swipe>
                    )
                )}
                {loading && (
                    <div className='center loader'>
                        <Loader/>
                    </div>
                )}
            </div>
        </Container>
    )
}

// const tepl = {
//     created_at: "2023-08-10T04:37:31+03:00",
//     created_ip: "82.200.95.130",
//     created_location: "Novosibirsk",
//     created_user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
//     uid: "66",
//     update_location: "Novosibirsk",
//     updated_at: "2023-08-10T04:37:31+03:00",
//     updated_ip: "82.200.95.130",
// }