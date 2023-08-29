import dateToStringFormat from "../../../../utils/dateToStringFormat";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import {Chip} from "../../../../components/ui";

import IconButton from "../../../../components/ui/IconButton/IconButton";
import {PlusIcon} from "../../../../components/svg";
import './LocationCard.css'

export default function LocationCard({imgURL, dateStart, dateEnd, title, entityType, children, onAdd}) {
    const start = dateStart ? dateToStringFormat(dateStart, false) : null
    const end = dateEnd ? dateToStringFormat(dateEnd, false) : null

    return (
        <div className='location-container relative'>
            {!!start && <Chip className='location-date-start'>{start}</Chip>}
            {!!end && <Chip className='location-date-end'>{end}</Chip>}
            <div className='location-img'>
                <img className='img-abs' src={imgURL || DEFAULT_IMG_URL} alt="location image" />
            </div>
            <div className='location-title'>{title}</div>
            <div className='location-entity-type'>{entityType}</div>
            {children}
            {
                !!onAdd && (
                    <IconButton
                        className='location-add-button'
                        iconClass='location-add-button-icon'
                        icon={<PlusIcon/>}
                        border={true}
                        shadow={false}
                        small
                    />
                )
            }
        </div>
    )
}