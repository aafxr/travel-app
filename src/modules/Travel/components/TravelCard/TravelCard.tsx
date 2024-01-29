import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

import PhotoComponent from "../../../../components/PhotoComponent/PhotoComponent";
import {defaultMovementTags} from "../../../../components/defaultMovementTags";
import {useAppContext} from "../../../../contexts/AppContextProvider";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import {Travel} from "../../../../classes/StoreEntities";
import {Chip} from "../../../../components/ui";

import './TravelCard.css'

interface TravelCardPropsType {
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
    const context = useAppContext()
    const [tagsScrolling, setTextScrolling] = useState(false)
    const travelDays = travel.days === 1 ? '1 день' : `${travel.days} дней`

    function handleRemove() {
        onRemove && onRemove()
    }

    /**  обработка скрола тегов */
    function handleTagsMoving(e: React.TouchEvent<HTMLDivElement>, value: boolean) {
        e.stopPropagation()
        setTextScrolling(value)
    }

    function handleClickCard() {
        context.setTravel(travel)
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
                        <PhotoComponent className={'travel-image flex-0'} src={travel.getPhotoURL}/>
                        <div className='travel-content'>
                            <div className='travel-title w-full title-bold'>
                                {travel.title || travel.direction || ''}
                            </div>
                            <div
                                className='travel-movement row w-full gap-0.5'
                                onTouchStart={(e) => handleTagsMoving(e, true)}
                                onTouchMove={(e) => handleTagsMoving(e, true)}
                                onTouchEnd={(e) => handleTagsMoving(e, false)}
                            >
                                <Chip color='light-orange' rounded>{travelDays}</Chip>
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
                        </div>
                    </div>
                </div>
            </Swipe>
        </>
    )
}