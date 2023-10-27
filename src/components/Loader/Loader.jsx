import clsx from "clsx";
import './Loader.css'

/**
 * Компонент отобрадает иконку загрузки
 * @returns {JSX.Element}
 * @category Components
 */
export default function Loader({className}){
    return (
        <div className={clsx("lds-facebook", className)}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}