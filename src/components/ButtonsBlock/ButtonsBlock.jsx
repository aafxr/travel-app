import clsx from "clsx";
import { useState} from "react";
import {motion} from "framer-motion";

import PlusButton from "../ui/PlusButton/PlusButton";
import ShareLinkIcon from "../svg/ShareLinkIcon";
import {HotelIcon} from "../svg";

import './ButtonsBlock.css'


const icon_size = +getComputedStyle(document.documentElement).getPropertyValue('--control-button-size') || 40;

const buttons = [
    {id: 'hotel', description: "Добавить отель", icon: <HotelIcon/>},
    {id: 'appointment', description: "Добавить встречу", icon: <HotelIcon/>},
    {id: 'invite', description: "Пригласить пользователя", icon: <ShareLinkIcon/>}
]

/**
 * Компонент добавляет кнопку меню ( для добавленияб отелей, встреч )
 * @function
 * @name ButtonsBlock
 * @param className css class
 * @param onInvite callback, вызывается при нажатии на кнопку invite
 * @param onHotel callback, вызывается при нажатии на кнопку hotel
 * @param onAppointment callback, вызывается при нажатии на кнопку appointment
 * @param props other props (addd to main block of component)
 * @returns {JSX.Element}
 * @category Components
 */
export default function ButtonsBlock({className, onInvite, onHotel,onAppointment, ...props}) {
    const [isOpen, setIsOpen] = useState(false)

    const btnAnimationVariant = {
        visible: (n) => ({
                y: -icon_size * (n + 1.2) - icon_size * 0.2 * n,
                opacity: 1,

        })
    }

    // useEffect(() => {
    //     isOpen && animate(".buttons-block-btn", { y }, { delay: stagger(0.5) })
    // }, [isOpen])

    function handleButtonClick(btn){
        switch (btn.id){
            case 'invite' :
                onInvite && onInvite()
                break
            case 'hotel':
                onHotel && onHotel()
                break
            case 'appointment':
                onAppointment && onAppointment()
                break
        }
    }

    return (
        <motion.div
            {...props}
            className={clsx('buttons-block-container gap-0.25', isOpen && 'active', className)}
            animate={'visible'}
            variants={{
                visible: {
                    padding: -10,
                    height: isOpen ?  icon_size * (buttons.length + 1.2) + icon_size * 0.2 * buttons.length : icon_size * 1.2,
                    transition: {
                        duration: 0.3,
                        staggerChildren: 1
                    }
                }
            }}
        >
            {
                isOpen && buttons.map((b, idx) => (
                    <motion.div
                        key={b.id}
                        className='buttons-block-btn flex-stretch gap-1 center'
                        initial={'hidden'}
                        animate={'visible'}
                        variants={btnAnimationVariant}
                        transition={{duration: 0.3}}
                        custom={idx}
                        onClick={() => handleButtonClick(b)}
                    >
                        <div className='title-semi-bold flex-1'>{b.description}</div>
                        <button className='rounded-button'>{b.icon}</button>
                    </motion.div>
                ))
            }

            <PlusButton className={'buttons-block-btn'} init={false} onChange={setIsOpen}/>
        </motion.div>
    )
}