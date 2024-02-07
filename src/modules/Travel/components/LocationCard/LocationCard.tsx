import {PropsWithChildren} from "react";

import {CheckIcon, EditePencil, PhotoIcon, PlusIcon, TrashIcon} from "../../../../components/svg";
import PhotoCarousel from "../../../../components/PhotoCarousel/PhotoCarousel";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import dateToStringFormat from "../../../../utils/dateToStringFormat";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import {Place} from "../../../../classes/StoreEntities";
import {Chip} from "../../../../components/ui";

import './LocationCard.css'
import {PlaceKind} from "../../../../types/PlaceKindType";

interface LocationCardPropsCard extends PropsWithChildren {
    place: Place
    showTime?: boolean
    onAdd?: (place: Place) => unknown
    onEdite?: (place: Place) => unknown
    onDelete?: (place: Place) => unknown
    selected?: boolean
    onPhotoAdd?: (place: Place) => unknown
}

/**
 * Компонент - карточка с описанием места
 * @function
 * @name LocationCard
 * @param {string} id
 * @param {boolean} selected
 * @param children
 * @param {(item) => void} onAdd
 * @param {(item) => void} onEdite
 * @param {(item) => void} onDelete
 * @param {(item) => void} onPhotoAdd
 * @returns {JSX.Element}
 */
export default function LocationCard({
                                         place,
                                         showTime = false,
                                         children,
                                         onAdd,
                                         onEdite,
                                         onDelete,
                                         selected,
                                         onPhotoAdd
                                     }: LocationCardPropsCard) {
    const start = dateToStringFormat(place.time_start, false)
    const end = dateToStringFormat(place.time_end, false)

    const rightElement = (
        <div className='column gap-0.5'>
            {/*<PlusIcon className='control-button flex-0' onClick={() => onAdd && onAdd(id)}/>*/}
            {/*<EditePencil className='control-button flex-0' onClick={() => onEdite && onEdite(id)}/>*/}
            <div className='column' onClick={() => onDelete && onDelete(place)}>
                <TrashIcon className='control-button flex-0'/>
                <span>Удалить</span>
            </div>
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
                {showTime && <Chip className='location-date-start'>{start}</Chip>}
                {showTime && <Chip className='location-date-end'>{end}</Chip>}
                <div className='location-img'>
                    {
                        place.photos.length
                            ? <PhotoCarousel urls={place.photos} className='img-abs'/>
                            : <PhotoCarousel urls={[DEFAULT_IMG_URL]} className='img-abs'/>
                    }
                    {/*<PhotoCarousel urls={imgURLs} />*/}
                    <div className='location-buttons'>
                        {
                            !!onPhotoAdd && <button
                                className='rounded-button location-btn'
                                onClick={() => onPhotoAdd(place)}
                            >
                                <PhotoIcon/></button>
                        }
                        {
                            !!onEdite && <button
                                className='rounded-button location-btn'
                                onClick={() => onEdite(place)}
                            >
                                <EditePencil/></button>
                        }
                    </div>
                </div>
                <div className='location-title'>{place.name}</div>
                <div className='location-entity-type'>{PlaceKind[place.type]}</div>
                {children}
                {
                    !!onAdd && (
                        <IconButton
                            className='location-add-button'
                            iconClass='location-add-button-icon'
                            icon={selected ? <CheckIcon/> : <PlusIcon/>}
                            border={true}
                            shadow={false}
                            onClick={() => onAdd && onAdd(place)}
                            small
                        />
                    )
                }
            </div>
        </Swipe>
    )
}