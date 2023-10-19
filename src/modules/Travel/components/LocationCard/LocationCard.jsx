import IconButton from "../../../../components/ui/IconButton/IconButton";
import dateToStringFormat from "../../../../utils/dateToStringFormat";
import Photo from "../../../../components/Poto/Photo";
import {PhotoIcon, PlusIcon} from "../../../../components/svg";
import {Chip} from "../../../../components/ui";

import './LocationCard.css'
import EditePencil from "../../../../components/svg/EditePencil";

export default function LocationCard({imgID, dateStart, dateEnd, title, entityType, children, onAdd}) {
    const start = dateStart ? dateToStringFormat(dateStart, false) : null
    const end = dateEnd ? dateToStringFormat(dateEnd, false) : null

    return (
        <div className='location-container relative'>
            {!!start && <Chip className='location-date-start'>{start}</Chip>}
            {!!end && <Chip className='location-date-end'>{end}</Chip>}
            <div className='location-img'>
                <Photo id={imgID} className={'img-abs'}/>
                <div className='location-buttons'>
                    <button className='rounded-button location-btn'><PhotoIcon /></button>
                    <button className='rounded-button location-btn'><EditePencil /></button>
                </div>
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