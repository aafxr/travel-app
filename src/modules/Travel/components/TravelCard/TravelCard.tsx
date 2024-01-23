import React, {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import {defaultMovementTags} from "../../../../components/defaultMovementTags";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import {Travel} from "../../../../classes/StoreEntities";
import {MS_IN_DAY} from "../../../../static/constants";
import Photo from "../../../../components/Photo/Photo";
import {Chip} from "../../../../components/ui";

import './TravelCard.css'

interface TravelCardPropsType{
    travel: Travel,
    onRemove: Function
}

/**
 * компонент отображает карточку путешествия
 * @param {TravelType} travel
 * @param {function} onRemove
 * @returns {JSX.Element}
 * @constructor
 */
export default function TravelCard({travel, onRemove}: TravelCardPropsType) {
    const navigate = useNavigate()
    const [tagsScrolling, setTextScrolling] = useState(false)
    const travelDays = useMemo(() => {
        if (travel) {
            const start = travel.date_start
            const end = travel.date_end
            const duration = end.getTime() - start.getTime()

            if (duration > 0) {
                const d = Math.ceil(duration / MS_IN_DAY)
                return d === 1 ? '1 день' : `${d} дней`
            } else if (duration === 0) {
                return '1 день'
            }
        }
        return null
    }, [travel.date_start, travel.date_end])

    function handleRemove() {
        onRemove && onRemove()
    }

    /**  обработка скрола тегов */
    function handleTagsMoving(e: React.TouchEvent<HTMLDivElement>, value: boolean) {
        e.stopPropagation()
        setTextScrolling(value)
    }

    function handleClickCard(){
        navigate(`/travel/${travel.id}/`)
    }

    return (
        <>
            <Swipe
                className='travel-card-swiper'
                onRemove={handleRemove}
                rightButton={!tagsScrolling}
                onClick={handleClickCard}
            >
                <div className='travel-item'>
                    <div className='flex-between gap-0.5'>
                        <Photo className={'travel-image flex-0'} src={travel.imageURL}/>
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
                                                    key={'' + mt}
                                                    color='light-orange'
                                                    icon={defaultMovementTags.find(dm => dm.id === mt)?.icon}
                                                    iconPosition='left'
                                                    rounded
                                                >
                                                    {defaultMovementTags.find(dm => dm.id === mt)?.title}
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