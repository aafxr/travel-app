import {createContext, useEffect, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";

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
 * @property {string} hash
 */

/**
 * @function TelegramAuthToApp
 * @param {UserAuthType} user
 */

/**
 * @typedef {Object} UserContextType
 * @property {UserAppType | null} user
 * @property {TelegramAuthToApp} setUser
 */

/**
 *
 * @type {React.Context<UserContextType>}
 */
export const UserContext = createContext({})


export default function UserContextProvider(){
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    /**@type {TelegramAuthToApp} */
    function handleUserAuth(user){
        const result = user
        result.id = 'tg:' + result.id.toString()
        console.log(result)
        localStorage.setItem(USER_AUTH, JSON.stringify(result))
        setUser(result)
    }

    useEffect(() => {
        const us = JSON.parse(localStorage.getItem(USER_AUTH))
        setUser(us)
    }, [])

    if (!user){
        navigate('/')
    }

    return (
        <UserContext.Provider value={{user, setUser: handleUserAuth}}>
            <Outlet />
        </UserContext.Provider>
    )

}