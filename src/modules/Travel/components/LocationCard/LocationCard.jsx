import {DEFAULT_IMG_URL} from "../../../../static/constants";
import {Chip} from "../../../../components/ui";

import dateToStringFormat from "../../../../utils/dateToStringFormat";

import './LocationCard.css'

export default function LocationCard({imgURL, dateStart, dateEnd, title, entityType, children}) {
    const start = dateStart ? dateToStringFormat(dateStart, false) : null
    const end = dateEnd ? dateToStringFormat(dateEnd, false) : null

    return (
        <div className='location-container relative'>
            {!!start && <Chip className='location-date-start'>{start}</Chip>}
            {!!end && <Chip className='location-date-end'>{end}</Chip>}
            <div className='location-img'>
                <img className='img-abs' src={imgURL || DEFAULT_IMG_URL} alt="location image"/>
            </div>
            <div className='location-title'>{title}</div>
            <div className='location-entity-type'>{entityType}</div>
            {children}
        </div>
    )
}