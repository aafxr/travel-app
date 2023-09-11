import clsx from "clsx";

import UserLocationIcon from "../svg/userLocationIcon";
import MinusIcon from "../svg/MinusIcon";
import {PlusIcon} from "../svg";

import './MapControls.css'

export default function MapControls({className, onPlusClick, onMinusClick, onUserLocationClick,...props}) {
    return (
        <div {...props} className={clsx('map-controls column gap-0.5', className)} >
            <button className='map-control-btn center' onClick={onPlusClick}><PlusIcon/></button>
            <button className='map-control-btn center' onClick={onMinusClick}><MinusIcon/></button>
            <button className='map-control-btn center' onClick={onUserLocationClick}><UserLocationIcon/></button>
        </div>
    )
}
