import {useState} from "react";
import {useNavigate} from "react-router-dom";
import clsx from "clsx";

import MenuIconList from "../MenuIconList/MenuIconList";
import {MenuIcon} from "../svg";

import useOutside from "../../hooks/useOutside";

import storeDB from "../../db/storeDB/storeDB";
import constants, {REFRESH_TOKEN, USER_AUTH} from "../../static/constants";
import errorReport from "../../controllers/ErrorReport";
import aFetch from "../../axios";

import './Menu.css'
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../../redux/store";

export default function Menu() {
    const dispatch = useDispatch()
    const {user} = useSelector(state => state[constants.redux.USER])
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
                                dispatch(actions.userActions.updateUser(null))
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