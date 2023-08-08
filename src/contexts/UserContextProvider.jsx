import {createContext, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";

import {USER_AUTH} from "../static/constants";

/**
 * объект которы предоставляет telegram auth widget
 *@typedef {Object} UserAuthType
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {number} auth_date
 * @property {string} hash
 */

/**
 * @typedef {Object} UserAppType
 * @property {string} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {number} auth_date
 * @property {string} photo_url
 * @property {string} hash
 */

/**
 * @function TelegramAuthHandler
 * @param {UserAuthType} user
 */

/**
 * @typedef {Object} UserContextType
 * @property {UserAppType | null} user
 * @property {TelegramAuthHandler} setUser
 */

/**
 *
 * @type {React.Context<UserContextType>}
 */
export const UserContext = createContext({})


export default function UserContextProvider() {
    const [user, setUser] = useState(null)

    /**@type {TelegramAuthHandler} */
    function handleUserAuth(user) {
        const result = user
        // result.id = 'tg:' + result.id.toString()
        // console.log(result)
        localStorage.setItem(USER_AUTH, JSON.stringify(result))
        setUser(result)
    }

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            /**@type{UserAppType} */
            const userPH = {
                id: '12',
                first_name: 'Иван',
                last_name: 'Алексеев'
            }
            setUser(userPH)
        } else {
            const us = JSON.parse(localStorage.getItem(USER_AUTH))
            setUser(us)
        }

    }, [])


    return (
        <UserContext.Provider value={{user, setUser: handleUserAuth}}>
            <Outlet/>
        </UserContext.Provider>
    )

}