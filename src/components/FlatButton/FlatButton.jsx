import clsx from "clsx";
import {motion} from "framer-motion";
import {useEffect, useState} from "react";

import {AppointmentIcon, HotelIcon, TerrainIcon} from "../svg";
import BlurBackplate from "../BlurBackplate/BlurBackplate";
import PlusButton from "../ui/PlusButton/PlusButton";
import ShareLinkIcon from "../svg/ShareLinkIcon";

import './FlatButton.css'


const icon_size = +getComputedStyle(document.documentElement).getPropertyValue('--control-button-size') || 40;

const buttons = [
    // {id: 'appointment', description: "Добавить встречу", icon: <AppointmentIcon/>},
    // {id: 'hotel', description: "Добавить отель", icon: <HotelIcon/>},
    {id: 'place', description: "Добавить место", icon: <TerrainIcon/>},
    // {id: 'invite', description: "Пригласить пользователя", icon: <ShareLinkIcon/>}
]

/**
 * Компонент добавляет кнопку меню ( для добавленияб отелей, встреч )
 * @function
 * @name FlatButton
 * @param className css class
 * @param {boolean} open default = false, состояние кнопкм
 * @param {(val: boolean) => void} onChange callback, вызывается на изменение состояния
 * @param onInvite callback, вызывается при нажатии на кнопку invite
 * @param onHotel callback, вызывается при нажатии на кнопку hotel
 * @param onAppointment callback, вызывается при нажатии на кнопку appointment
 * @param onPlace callback, вызывается при нажатии на кнопку place
 * @param props other props (add to main block of component)
 * @returns {JSX.Element}
 * @category Components
 */
export default function FlatButton({
                                       className,
                                       open = false,
                                       onInvite,
                                       onHotel,
                                       onAppointment,
                                       onChange,
                                       onPlace,
                                       ...props
                                   }) {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(open)
    }, [open])

    const btnAnimationVariant = {
        visible: (n) => ({
            y: -icon_size * (n + 1.2) - icon_size * 0.2 * n,
            opacity: 1,
            pointerEvents: 'all',
            transition: {
                delay: 0.1 * n,
                type: "Inertia"
            }
        }),
        hidden: (n) => ({
            y: 0,
            opacity: 0,
            pointerEvents: 'none',
            transition: {
                delay: 0.1 * (buttons.length - n),
                type: "Inertia"
            }
        })
    }


    function handleButtonClick(btn, e) {
        e.stopPropagation()
        switch (btn.id) {
            case 'invite' :
                onInvite && onInvite()
                break
            case 'hotel':
                onHotel && onHotel()
                break
            case 'appointment':
                onAppointment && onAppointment()
                break
            case 'place':
                onPlace && onPlace()
                break
            default:
                break
        }
    }

    function handlePlusButtonClick(val) {
        setIsOpen(val)
        onChange && onChange(val)

    }

    return (
        <>
            {isOpen &&
                <BlurBackplate
                    onClick={() => setIsOpen(false)}
                    style={{zIndex: 1000}}
                />}
            <motion.div
                {...props}
                className={clsx('buttons-block-container gap-0.25', isOpen && 'active', className)}
            >
                {
                    buttons.map((b, idx) => (
                        <motion.div
                            key={b.id}
                            className='buttons-block-btn flex-stretch gap-1 center'
                            initial={'hidden'}
                            animate={isOpen ? 'visible' : 'hidden'}
                            variants={btnAnimationVariant}
                            transition={{duration: 0.3}}
                            custom={idx}
                            onClick={(e) => handleButtonClick(b, e)}
                        >
                            <div className='title-semi-bold flex-1'>{b.description}</div>
                            <button className='rounded-button'>
                                {b.icon}
                            </button>
                        </motion.div>
                    ))
                }

                <PlusButton className={'buttons-block-btn'} init={isOpen} onChange={handlePlusButtonClick}/>
            </motion.div>
        </>
    )
}
