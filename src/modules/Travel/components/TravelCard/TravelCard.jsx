import React, {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import {defaultMovementTags} from "../../../../static/constants";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import Photo from "../../../../components/Poto/Photo";
import {Chip} from "../../../../components/ui";

import './TravelCard.css'

/**
 * компонент отображает карточку путешествия
 * @param {TravelType} travel
 * @param {function} onRemove
 * @returns {JSX.Element}
 * @constructor
 */
export default function TravelCard({travel, onRemove}) {
    const navigate = useNavigate()
    const [tagsScrolling, setTextScrolling] = useState(false)
    const travelDays = useMemo(() => {
        if (travel) {
            const start = travel.date_start ? new Date(travel.date_start).getTime() : 0
            const end = travel.date_end ? new Date(travel.date_end).getTime() : 0
            const duration = end - start
            if (duration > 0) {
                const d = Math.ceil(duration / (1000 * 60 * 60 * 24))
                return d === 1 ? '1 день' : `${d} дней`
            } else if (duration === 0) {
                return '1 день'
            }
        }
        return null
    })

    function handleRemove() {
        onRemove && onRemove()
    }

    /**
     * обработка скрола тегов
     * @param {TouchEvent<HTMLDivElement>} e
     * @param {boolean} value
     */
    function handleTagsMoving(e, value) {
        e.stopPropagation()
        setTextScrolling(value)
    }


    return (
        <>
            <Swipe
                className='travel-card-swiper'
                onRemove={handleRemove}
                rightButton={!tagsScrolling}
                onClick={() => navigate(`/travel/${travel.id}/`)}
            >
                <div className='travel-item'>
                    <div className='flex-between gap-0.5'>
                        <Photo className={'travel-image flex-0'} id={travel.photo}/>
                        <div className='travel-content'>
                            <div className='travel-title w-full title-bold'>
                                {travel.title || travel.direction || ''}
                            </div>
                            {
                                !!travel && !!travel.movementTypes && (
                                    <div
                                        className='travel-movement row w-full gap-0.5'
                                        onTouchStart={(e) => handleTagsMoving(e, true)}
                                        onTouchMove={(e) => handleTagsMoving(e, true)}
                                        onTouchEnd={(e) => handleTagsMoving(e, false)}
                                    >
                                        { travelDays && <Chip color='light-orange' rounded>{travelDays}</Chip>}
                                        {
                                            travel.movementTypes.map(mt => (
                                                <Chip
                                                    key={mt.id}
                                                    color='light-orange'
                                                    icon={defaultMovementTags.find(dm => dm.id === mt.id)?.icon}
                                                    iconPosition='left'
                                                    rounded
                                                >
                                                    {mt.title}
                                                </Chip>
                                            ))
                                        }
                                    </div>

                                )
                            }
                        </div>
                    </div>
                </div>
            </Swipe>
        </>
    )
}