import React, {useEffect, useState} from "react";

import {PageHeader} from "../../../../components/ui";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import Container from "../../../../components/Container/Container";
import SessionItem from "../../../../components/SessionItem/SessionItem";
import Loader from "../../../../components/Loader/Loader";

import aFetch from "../../../../axios";
import storeDB from "../../../../classes/db/storeDB/storeDB";
import constants, {REFRESH_TOKEN} from "../../../../static/constants";
import useUserSelector from "../../../../hooks/useUserSelector";


/**
 * @typedef {object} SessionDataType
 * @property {string} created_at
 * @property {string} created_ip
 * @property {string} created_location
 * @property {string} created_user_agent
 * @property {string} uid
 * @property {string} update_location
 * @property {string} updated_at
 * @property {string} updated_ip
 * @property {boolean} active
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

    const [currentSession, setCurrentSession] = useState(null)
    const [authList, setAuthList] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (user) {
            storeDB.getOne(constants.store.STORE, REFRESH_TOKEN)
                .then(rt => {
                    aFetch.post('/user/auth/getList/', {[REFRESH_TOKEN]: rt?.value || ''})
                        .then(res => res.data)
                        .then(({ok, data}) => {
                            console.log({ok, data})
                            if (ok) {
                                setCurrentSession(data.find(a => a.active))
                                setAuthList(data.filter(a => !a.active).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)))
                                setLoading(false)
                            }
                        })
                        .catch(console.error)
                })
        }
    }, [user])


    function removeSessionHandler(auth) {
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