import PhotoCarousel from "../../../../components/PhotoCarousel/PhotoCarousel";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import dateToStringFormat from "../../../../utils/dateToStringFormat";
import EditePencil from "../../../../components/svg/EditePencil";
import {CheckIcon, PhotoIcon, PlusIcon, TrashIcon} from "../../../../components/svg";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import {Chip} from "../../../../components/ui";

import './LocationCard.css'
import useTravelContext from "../../../../hooks/useTravelContext";

/**
 * Компонент - карточка с описанием места
 * @function
 * @name LocationCard
 * @param {string} id
 * @param {string} imgID
 * @param {string[]} imgURLs
 * @param {string} dateStart
 * @param {string} dateEnd
 * @param {string} title
 * @param {string} entityType
 * @param {boolean} selected
 * @param item
 * @param children
 * @param {(item) => void} onAdd
 * @param {(item) => void} onEdite
 * @param {(item) => void} onDelete
 * @param {(item) => void} onPhotoAdd
 * @returns {JSX.Element}
 */
export default function LocationCard({
                                         imgID,
                                         id,
                                         imgURLs,
                                         dateStart,
                                         dateEnd,
                                         title,
                                         entityType,
                                         children,
                                         onAdd,
                                         onEdite,
                                         onDelete,
                                         selected,
                                         item,
                                         onPhotoAdd
                                     }) {
    const start = dateStart ? dateToStringFormat(dateStart, false) : null
    const end = dateEnd ? dateToStringFormat(dateEnd, false) : null

    console.log(item)
    const rightElement = (
        <div className='column gap-0.5'>
            {/*<PlusIcon className='control-button flex-0' onClick={() => onAdd && onAdd(id)}/>*/}
            {/*<EditePencil className='control-button flex-0' onClick={() => onEdite && onEdite(id)}/>*/}
            <TrashIcon className='control-button flex-0' onClick={() => onDelete && onDelete(item)}/>
        </div>
    )

    return (
        <Swipe
            className={'location'}
            rightButton
            rElemBg='location-swipe-right'
            lElemBg='location-swipe-left'
            rightElement={rightElement}

        >
            <div className='location-container relative'>
                {!!start && <Chip className='location-date-start'>{start}</Chip>}
                {!!end && <Chip className='location-date-end'>{end}</Chip>}
                <div className='location-img'>
                    {
                        (imgURLs && imgURLs.length)
                            ? <PhotoCarousel urls={imgURLs} className='img-abs'/>
                            : <PhotoCarousel urls={[DEFAULT_IMG_URL]} className='img-abs'/>
                    }
                    {/*<PhotoCarousel urls={imgURLs} />*/}
                    <div className='location-buttons'>
                        {
                            !!onPhotoAdd && <button
                                className='rounded-button location-btn'
                                onClick={() => onPhotoAdd(item)}
                            >
                                <PhotoIcon/></button>
                        }
                        {
                            !!onEdite && <button
                                className='rounded-button location-btn'
                                onClick={() => onEdite(item)}
                            >
                                <EditePencil/></button>
                        }
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
                            icon={selected ? <CheckIcon/> : <PlusIcon/>}
                            border={true}
                            shadow={false}
                            onClick={() => onAdd && onAdd(item)}
                            small
                        />
                    )
                }
            </div>
        </Swipe>
    )
}