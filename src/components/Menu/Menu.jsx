import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import clsx from "clsx";

import {UserContext} from "../../contexts/UserContextProvider";
import MenuIconList from "../MenuIconList/MenuIconList";
import {MenuIcon} from "../svg";

import useOutside from "../../hooks/useOutside";

import './Menu.css'

export default function Menu() {
    const {user} = useContext(UserContext)
    const navigation = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const {ref} = useOutside(false, setIsOpen)


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
                    onClick={() => navigation('/login/')}
                >
                    {user ? 'Выйти' : 'Войти'}
                </div>
            </div>
        </div>
    )
}