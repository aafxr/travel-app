import './Loader.css'

/**
 * Компонент отобрадает иконку загрузки
 * @returns {JSX.Element}
 * @category Components
 */
export default function Loader(){
    return (
        <div className="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}