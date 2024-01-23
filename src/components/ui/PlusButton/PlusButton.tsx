import clsx from "clsx";
import {useEffect, useState} from "react";
import {motion, Variants} from 'framer-motion'

import {PlusIcon} from "../../svg";

type PlusButtonPropsType = {
    init?: boolean
    onChange?: (isRotate: boolean) => unknown
    className?: string
}

/**
 * Кнопкка с иконкой "+"
 * @param {boolean} init начальное состояние кнопки
 * @param {function} onChange handler изменения состояния кнопки
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function PlusButton({init, onChange, className}: PlusButtonPropsType){
    const [rotate, setRotate] = useState(false)
    const cn = clsx('rounded-button', className)
    const variant: Variants ={
        hidden: {
            rotate: 0,
            opacity: 0,
            type:'Inertia'
        },
        visible: (isRotated) => ({
            rotate: isRotated ? -45 : 0,
            opacity: 1,
            duration: 0.1,
            type:'Inertia'
        })
    }

    useEffect(() =>{
        if (init !== undefined && init !== rotate) setRotate(init)
    }, [init])


    function handleButtonClick(){
        setRotate(!rotate)
        onChange && onChange(!rotate)
    }

    return (
        <motion.button
            className={cn}
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