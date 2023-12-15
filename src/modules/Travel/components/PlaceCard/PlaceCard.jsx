import {useEffect, useState} from "react";

import PhotoCarousel from "../../../../components/PhotoCarousel/PhotoCarousel";
import ChipInput from "../../../../components/ui/ChipInput/ChipInput";
import useTravelContext from "../../../../hooks/useTravelContext";
import EditePencil from "../../../../components/svg/EditePencil";
import {PhotoIcon, TrashIcon} from "../../../../components/svg";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import {Chip} from "../../../../components/ui";

import './PlaceCard.css'
import useUserSelector from "../../../../hooks/useUserSelector";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";

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
    const user = useUserSelector()
    const {travel} = useTravelContext()
    const [startChange, setStartChange] = useState(false)
    const [endChange, setEndChange] = useState(false)
    const [start, setStart] = useState(() => placeActivity.start.toLocaleTimeString().split(':').slice(0, 2).join(':'))
    const [end, setEnd] = useState(() => placeActivity.end.toLocaleTimeString().split(':').slice(0, 2).join(':'))
    const [place, setPlace] = useState(/**@type{PlaceType}*/ null)


    useEffect(() => {
        if(placeActivity.place)
            setPlace(placeActivity.place)

        setStart(placeActivity.start.toLocaleTimeString().split(':').slice(0, 2).join(':'))
        setEnd(placeActivity.end.toLocaleTimeString().split(':').slice(0, 2).join(':'))
    }, [placeActivity.place, travel])




    const rightElement = (
        <div className='column gap-0.5'>
            {/*<PlusIcon className='control-button flex-0' onClick={() => onAdd && onAdd(id)}/>*/}
            {/*<EditePencil className='control-button flex-0' onClick={() => onEdite && onEdite(id)}/>*/}
            <TrashIcon className='control-button flex-0' onClick={() => onDelete && onDelete(place)}/>
        </div>
    )

    /**
     * @param {string} time
     * @param {Date} date
     * @param {'start' | 'end'} type
     */
    function handleTime(time, date, type) {
        const duration = placeActivity.end - placeActivity.start
        if (time) {
            if (type === 'start') {
                placeActivity.setStart(new Date(date))
                placeActivity.setEnd(new Date(date.getTime() + duration))
                travel.updatePlace({...placeActivity.place})
                    .save(user.id)
                    .catch(defaultHandleError)
                setStartChange(false)
                setStart(time)
                setEnd(new Date(date.getTime() + duration).toLocaleTimeString().slice(0, -3))
            } else if (type === 'end') {
                placeActivity.setEnd(new Date(date))
                travel.updatePlace({...placeActivity.place})
                    .save(user.id)
                    .catch(defaultHandleError)
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
                    !!place && (
                        <>

                            {
                                !!start && !startChange
                                    ? <Chip
                                        onTouchStart={(e) => setStartChange(true)}
                                        className='place-date-start'
                                    > {start} </Chip>
                                    : <ChipInput
                                        className='place-date-start'
                                        template='hh:mm'
                                        value={new Date(placeActivity.start)}
                                        onBlur={(time, date) => handleTime(time, date, 'start')}
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
                                        templates='hh:mm'
                                        value={new Date(placeActivity.end)}
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

