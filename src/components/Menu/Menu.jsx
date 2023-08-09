import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import clsx from "clsx";

import {UserContext} from "../../contexts/UserContextProvider";
import MenuIconList from "../MenuIconList/MenuIconList";
import {MenuIcon} from "../svg";

import useOutside from "../../hooks/useOutside";

import './Menu.css'
import storeDB from "../../db/storeDB/storeDB";
import constants, {ACCESS_TOKEN, REFRESH_TOKEN} from "../../static/constants";
import errorReport from "../../controllers/ErrorReport";

export default function Menu() {
    const {user,setUser} = useContext(UserContext)
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const {ref} = useOutside(false, setIsOpen)

    function handleLogin() {
        if(user){
            Promise.all([
                storeDB.removeElement(constants.store.STORE, ACCESS_TOKEN),
                storeDB.removeElement(constants.store.STORE, REFRESH_TOKEN)
            ])
                .then(() => {
                    navigate('/')
                    setUser(null)
                })
                .catch(err=> {
                    console.error(err)
                    errorReport.sendError(err).catch(console.error)
                })
        }else{
            navigate('/login/')
        }
    }


    return (
        <div ref={ref} className={clsx('menu', {'open': isOpen})}>
            <div className='menu-dots' onClick={() => setIsOpen(!isOpen)}>
                <MenuIcon/>
            </div>
            <div className='menu-container column gap-0.5'>
                <div className='menu-icons row flex-nowrap gap-1'>
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