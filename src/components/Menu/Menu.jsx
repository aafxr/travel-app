import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import clsx from "clsx";

import {UserContext} from "../../contexts/UserContextProvider";
import MenuIconList from "../MenuIconList/MenuIconList";
import {MenuIcon} from "../svg";

import useOutside from "../../hooks/useOutside";

import storeDB from "../../db/storeDB/storeDB";
import constants, {ACCESS_TOKEN, REFRESH_TOKEN, USER_AUTH} from "../../static/constants";
import errorReport from "../../controllers/ErrorReport";
import aFetch from "../../axios";
import axios from "axios";

import './Menu.css'

export default function Menu() {
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const {ref} = useOutside(false, setIsOpen)

    function handleLogin() {
        if (user) {
            storeDB
                .getElement(constants.store.STORE, REFRESH_TOKEN)
                .then(refresh_token => {
                        console.log('refresh_token ', refresh_token)
                        aFetch.post(process.env.REACT_APP_SERVER_URL + '/user/auth/remove/', {[REFRESH_TOKEN]: refresh_token[0]?.value})
                            .then(() => {
                                localStorage.setItem(USER_AUTH, JSON.stringify(null))
                                setUser(null)
                                navigate('/')
                            })
                            .catch(err => {
                                console.error(err)
                                errorReport.sendError(err).catch(console.error)
                            })
                    }
                )

        } else {
            navigate('/login/')
        }
    }


    return (
        <div ref={ref} className={clsx('menu', {'open': isOpen})}>
            <div className='menu-dots' onClick={() => setIsOpen(!isOpen)}>
                <MenuIcon/>
            </div>
            <div className='menu-container column gap-0.5'>
                <div className='menu-icons row flex-nowrap gap-1 pb-20'>
                    <MenuIconList/>
                </div>

                <div
                    className='menu-item'
                    onClick={handleLogin}
                >
                    {user ? 'Выйти' : 'Войти'}
                </div>
            </div>
        </div>
    )
}