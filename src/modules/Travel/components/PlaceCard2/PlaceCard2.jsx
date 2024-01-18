import {useEffect, useState} from "react";

import PhotoCarousel from "../../../../components/PhotoCarousel/PhotoCarousel";
import ChipInput from "../../../../components/ui/ChipInput/ChipInput";
import useTravelContext from "../../../../hooks/useTravelContext";
import {EditePencil, PhotoIcon, TrashIcon} from "../../../../components/svg";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import {Chip} from "../../../../components/ui";

import '../PlaceCard/PlaceCard.css'
import useUserSelector from "../../../../hooks/useUserSelector";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";

/**
 * Компонент - карточка с описанием места
 * @function
 * @name LocationCard
 * @param children
 * @param {PlaceType} place
 * @param {(item) => void} onAdd
 * @param {(item) => void} onEdite
 * @param {(item) => void} onDelete
 * @param {(item) => void} onPhotoAdd
 * @returns {JSX.Element}
 */
export default function PlaceCard2({children, place, onAdd, onEdite, onDelete, onPhotoAdd}) {
    const user = useUserSelector()
    const {travel} = useTravelContext()
    const [startChange, setStartChange] = useState(false)
    const [endChange, setEndChange] = useState(false)
    const [start, setStart] = useState(() => place.time_start.toLocaleTimeString().split(':').slice(0, 2).join(':'))
    const [end, setEnd] = useState(() => place.time_end.toLocaleTimeString().split(':').slice(0, 2).join(':'))


    useEffect(() => {
        setStart(place.time_start.toLocaleTimeString().split(':').slice(0, 2).join(':'))
        setEnd(place.time_end.toLocaleTimeString().split(':').slice(0, 2).join(':'))
    }, [place, travel])




    const rightElement = (
        <div className='right-element column gap-0.5'>
            {/*<PlusIcon className='control-button flex-0' onClick={() => onAdd && onAdd(id)}/>*/}
            {/*<EditePencil className='control-button flex-0' onClick={() => onEdite && onEdite(id)}/>*/}
            <div className='right-element-item'>
                <TrashIcon className='control-button flex-0 icon' onClick={() => onDelete && onDelete(place)}/>
                удалить
            </div>
        </div>
    )

    /**
     * @param {string} time
     * @param {Date} date
     * @param {'start' | 'end'} type
     */
    function handleTime(time, date, type) {
        const duration = place.time_end - place.time_start
        if (time) {
            if (type === 'start') {
                travel
                    .updatePlace({
                        ...place,
                        time_start: new Date(date),
                        time_end: new Date(date.getTime() + duration),
                    })
                    .save(user.id)
                    .catch(defaultHandleError)
                setStartChange(false)
                setStart(time)
                setEnd(new Date(date.getTime() + duration).toLocaleTimeString().slice(0, -3))
            } else if (type === 'end') {
                travel
                    .updatePlace({
                        ...place,
                        time_end: new Date(date),
                    })
                    .save(user.id)
                    .catch(defaultHandleError)
                setEndChange(false)
                setEnd(time)
            }
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
                    !!place && (
                        <>

                            {
                                !!start && !startChange
                                    ? <Chip
                                        onTouchStart={(e) => setStartChange(true)}
                                        className='place-date-start'
                                        color={place.__expire ? "red" : "orange"}
                                    > {start} </Chip>
                                    : <ChipInput
                                        className='place-date-start'
                                        template='hh:mm'
                                        value={new Date(place.time_start)}
                                        onBlur={(time, date) => handleTime(time, date, 'start')}
                                    />
                            }
                            {
                                !!end && !endChange
                                    ? <Chip
                                        onTouchStart={(e) => setEndChange(true)}
                                        className='place-date-end'
                                        color={place.__expire ? "red" : "orange"}
                                    > {end} </Chip>
                                    : <ChipInput
                                        className='place-date-end'
                                        templates='hh:mm'
                                        value={new Date(place.time_end)}
                                        onBlur={(time, date) => handleTime(time, date, 'end')}
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
                        </>
                    )
                }
            </div>
        </Swipe>
    )
}

