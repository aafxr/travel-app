import {HTMLAttributes} from "react";
import clsx from "clsx";
import './Loader.css'

/**
 * Компонент отобрадает иконку загрузки
 * @returns {JSX.Element}
 * @category Components
 */
export default function Loader({className, ...props}: HTMLAttributes<HTMLSpanElement>){
    return (
        <span {...props} className={clsx("loader", className)}></span>
    )
    // return (
    //     <div {...props} className={clsx("lds-facebook", className)}>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //     </div>
    // )
}