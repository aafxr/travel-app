import React from "react";
import {useNavigate} from "react-router-dom";

import IconButton from "../../../../components/ui/IconButton/IconButton";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import Photo from "../../../../components/Poto/Photo";

import './TravelCard.css'

export default function TravelCard({travel, onRemove}) {


    const navigate = useNavigate()

    function handleClick(e) {
        e.stopPropagation()
        navigate(`/travel/${travel.id}/expenses/`)
    }

    function handleRemove() {
        onRemove && onRemove()
    }


    return (
        <>
            <Swipe
                onRemove={handleRemove}
                rightButton
                onClick={() => navigate(`/travel/${travel.id}/`)}
            >
                <div className='travel-item gap-1'>
                    <Photo className={'travel-image'} id={travel.photo} />
                    <div className='travel-content column title-bold'>
                        {travel.title}
                        <IconButton
                            className='travel-button'
                            onClick={handleClick}
                            title='Расходы'
                        />
                    </div>
                </div>
            </Swipe>
        </>
    )
}