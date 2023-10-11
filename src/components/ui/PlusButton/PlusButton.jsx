import clsx from "clsx";
import {useEffect, useState} from "react";
import {motion} from 'framer-motion'

import {PlusIcon} from "../../svg";

import './PlusButton.css'

/**
 * Кнопкка с иконкой "+"
 * @param {boolean} init начальное состояние кнопки
 * @param {function} onChange handler изменения состояния кнопки
 * @param {React.HTMLAttributes<HTMLButtonElement>} props
 * @returns {JSX.Element}
 * @constructor
 */
export default function PlusButton({init, onChange, ...props}){
    const [rotate, setRotate] = useState(false)
    const className = clsx('plus-button', props.className)
    const variant ={
        hidden: {
            rotate: 0,
            opacity: 0
        },
        visible: (isRotated) => ({
            rotate: isRotated ? -45 : 0,
            opacity: 1,
            duration: 0.1,
            type:'Tween'
        })
    }

    useEffect(() =>{
        if (typeof init === 'boolean') setRotate(init)
    }, [init])


    function handleButtonClick(){
        setRotate(!rotate)
        onChange && onChange(!rotate)
    }

    return (
        <motion.button
            {...props}
            className={className}
            onClick={handleButtonClick}
            initial={'hidden'}
            animate='visible'
            variants={variant}
            custom={rotate}
        >
            <PlusIcon className='icon'/>
        </motion.button>
    )
}