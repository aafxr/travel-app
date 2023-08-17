import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import constants, {REFRESH_TOKEN} from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import aFetch from "../../../../axios";
import Swipe from "../../../../components/ui/Swipe/Swipe";

import './Session.css'
import dateToStringFormat from "../../../../utils/dateToStringFormat";

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
 */

export default function Sessions() {
    const {user} = useSelector(state => state[constants.redux.USER])
    const [authList, setAuthList] = useState([])

    useEffect(() => {
        if (user) {
            storeDB.getOne(constants.store.STORE, REFRESH_TOKEN)
                .then(rt => {
                    aFetch.post('/user/auth/getList/', {[REFRESH_TOKEN]: rt.value})
                        .then(res => res.data)
                        .then(({ok, data}) => {
                            console.log({ok, data})
                            ok && setAuthList(data)
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
        <Container>
            <PageHeader arrowBack title='Активные сеансы'/>
            {!!authList.length && authList.map(
                /**@param{SessionDataType} a*/
                a => (
                    <Swipe
                        key={a.uid}
                        className='auth-item'
                        onRemove={() => removeSessionHandler(a)}
                        rightButton
                    >
                        <div className='action-item flex-between '>
                            <div className='column'>
                                <div className='action-item-description'>{a.updated_ip + ' - ' + a.created_user_agent.split('/').shift()}</div>
                                <div className='action-item-title'>{a.update_location || ''}</div>
                            </div>
                            <div className='action-item-time'>{dateToStringFormat(a.updated_at)}</div>
                        </div>
                    </Swipe>

                )
            )}
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
