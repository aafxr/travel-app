import clsx from "clsx";
import './Loader.css'
import {HTMLAttributes} from "react";

/**
 * Компонент отобрадает иконку загрузки
 * @returns {JSX.Element}
 * @category Components
 */
export default function Loader({className, ...props}: HTMLAttributes<HTMLDivElement>){
    return (
        <div {...props} className={clsx("lds-facebook", className)}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}