import PhotoCarousel from "../../../../components/PhotoCarousel/PhotoCarousel";
import dateToStringFormat from "../../../../utils/dateToStringFormat";
import EditePencil from "../../../../components/svg/EditePencil";
import {PhotoIcon, TrashIcon} from "../../../../components/svg";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import {Chip} from "../../../../components/ui";

import './PlaceCard.css'
import {useMemo, useState} from "react";
import ChipInput from "../../../../components/ui/ChipInput/ChipInput";
import useTravelContext from "../../../../hooks/useTravelContext";
import setDateTime from "../../../../utils/setDateTime";

/**
 * Компонент - карточка с описанием места
 * @function
 * @name LocationCard
 * @param children
 * @param {PlaceActivity} placeActivity
 * @param {(item) => void} onAdd
 * @param {(item) => void} onEdite
 * @param {(item) => void} onDelete
 * @param {(item) => void} onPhotoAdd
 * @returns {JSX.Element}
 */
export default function PlaceCard({children, placeActivity, onAdd, onEdite, onDelete, onPhotoAdd}) {
    const {travel} = useTravelContext()
    const [startChange, setStartChange] = useState(false)
    const [endChange, setEndChange] = useState(false)

    const place = placeActivity.place

    const [start, setStart] = useState(() => placeActivity.start.toLocaleTimeString().split(':').slice(0, 2).join(':'))
    const [end, setEnd] = useState(placeActivity.end.toLocaleTimeString().split(':').slice(0, 2).join(':'))


    const rightElement = (
        <div className='column gap-0.5'>
            {/*<PlusIcon className='control-button flex-0' onClick={() => onAdd && onAdd(id)}/>*/}
            {/*<EditePencil className='control-button flex-0' onClick={() => onEdite && onEdite(id)}/>*/}
            <TrashIcon className='control-button flex-0' onClick={() => onDelete && onDelete()}/>
        </div>
    )

    /**
     * @param {string} time
     * @param {'start' | 'end'} type
     */
    function handleTime(time, type) {
        const duration = placeActivity.end - placeActivity.start
        const _time = time.match(/\d{2}:\d{2}$/)[0]?.split(':')
        if (_time) {
            const [hh, mm] = _time
            if (type === 'start') {
                const date = setDateTime(placeActivity.start, {hh, mm})
                place.time_start = date.toISOString()
                place.time_end = new Date(date.getTime() + duration).toISOString()
                travel.updatePlace(place)
                setStartChange(false)
                setStart(time)
                setEnd(new Date(date.getTime() + duration).toLocaleTimeString().slice(0, -3))
            } else if (type === 'end') {
                const date = setDateTime(place.time_end, {hh, mm})
                travel.updatePlace({...place, time_end: date.toISOString()})
                setEndChange(false)
                setEnd(time)
            }
            placeActivity.shiftTimeBy()
        }
    }

    return (
        <Swipe
            className={'place'}
            rightButton
            rElemBg='place-swipe-right'
            lElemBg='place-swipe-left'
            rightElement={rightElement}

        >
            <div className='place-container relative'>
                {
                    !!start && !startChange
                        ? <Chip
                            onTouchStart={(e) => setStartChange(true)}
                            className='place-date-start'
                        > {start} </Chip>
                        : <ChipInput
                            className='place-date-start'
                            value={start}
                            onBlur={(time) => handleTime(time, 'start')}
                        />
                }
                {
                    !!end && !endChange
                        ? <Chip
                            onTouchStart={(e) => setEndChange(true)}
                            className='place-date-end'
                        > {end} </Chip>
                        : <ChipInput
                            className='place-date-end'
                            value={end}
                            onBlur={(time) => handleTime(time, 'end')}
                        />
                }
                <div className='place-img'>
                    {
                        (place.photos && place.photos.length)
                            ? <PhotoCarousel urls={place.photos} className='img-abs'/>
                            : <PhotoCarousel urls={[DEFAULT_IMG_URL]} className='img-abs'/>
                    }
                    {/*<PhotoCarousel urls={imgURLs} />*/}
                    <div className='place-buttons'>
                        {
                            !!onPhotoAdd && <button
                                className='rounded-button place-btn'
                                onClick={() => onPhotoAdd(place)}
                            >
                                <PhotoIcon/></button>
                        }
                        {
                            !!onEdite && <button
                                className='rounded-button place-btn'
                                onClick={() => onEdite(place)}
                            >
                                <EditePencil/></button>
                        }
                    </div>
                </div>
                <div className='place-title'>{place.name}</div>
                <div className='place-entity-type'>{place.formatted_address}</div>
                {children}
                {/*{*/}
                {/*    !!onAdd && (*/}
                {/*        <IconButton*/}
                {/*            className='location-add-button'*/}
                {/*            iconClass='location-add-button-icon'*/}
                {/*            icon={selected ? <CheckIcon/> : <PlusIcon/>}*/}
                {/*            border={true}*/}
                {/*            shadow={false}*/}
                {/*            onClick={() => onAdd && onAdd(item)}*/}
                {/*            small*/}
                {/*        />*/}
                {/*    )*/}
                {/*}*/}
            </div>
        </Swipe>
    )
}

