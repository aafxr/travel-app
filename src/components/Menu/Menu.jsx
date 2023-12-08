import clsx from "clsx";
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";

import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import constants, {REFRESH_TOKEN, USER_AUTH} from "../../static/constants";
import {UserContext} from "../../contexts/UserContextProvider";
import useUserSelector from "../../hooks/useUserSelector";
import MenuIconList from "../MenuIconList/MenuIconList";
import useOutside from "../../hooks/useOutside";
import storeDB from "../../db/storeDB/storeDB";
import aFetch from "../../axios";
import {MenuIcon} from "../svg";

import './Menu.css'

/**
 * Компонент для отображения меню
 * @param children
 * @param className
 * @returns {JSX.Element}
 * @category Components
 */
export default function Menu({children, className}) {
    const {setUser} = useContext(UserContext)
    const user = useUserSelector()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const {ref} = useOutside(false, setIsOpen)

    function handleLogin() {
        if (user) {
            storeDB
                .getOne(constants.store.STORE, REFRESH_TOKEN)
                .then(refresh_token => {
                        aFetch.post('/user/auth/remove/', {
                            [REFRESH_TOKEN]: refresh_token?.value
                        })
                            .then(() => {
                                localStorage.setItem(USER_AUTH, JSON.stringify(null))
                                setUser(null)
                                navigate('/')
                            })
                            .catch(defaultHandleError)
                    }
                )

        } else {
            navigate('/login/')
        }
    }


    return (
        <div ref={ref} className={clsx('menu', {'open': isOpen}, className)}>
            <div className='menu-dots' onClick={() => setIsOpen(!isOpen)}>
                <MenuIcon/>
            </div>
            <div className='menu-container column gap-0.5'>
                <div className='menu-icons row flex-nowrap gap-1 pb-20'>
                    <MenuIconList/>
                </div>
                {children}
                <div className='menu-item title-semi-bold' onClick={handleLogin} >
                    {user ? 'Выйти' : 'Войти'}
                </div>
            </div>
        </div>
    )
}