import React from "react";
import {useNavigate} from "react-router-dom";

import Swipe from "../../../../components/ui/Swipe/Swipe";
import IconButton from "../../../../components/ui/IconButton/IconButton";

import './TravelCard.css'

export default function TravelCard({id, title, onRemove}) {
    const navigate = useNavigate()

    function handleClick(e) {
        e.stopPropagation()
        navigate(`/travel/${id}/expenses/`)
    }

    function handleRemove(){
        onRemove && onRemove()
    }


    return (
        <Swipe
            onRemove={handleRemove}
            rightButton
            onClick={() => navigate(`/travel/${id}/`)}
        >
            <div className='travel-item gap-1'>
                <div className='travel-image no-resize'>
                    <img className='img-abs' src={process.env.PUBLIC_URL + '/images/travel-placeholder.jpg'}
                         alt='travel'/>
                </div>
                <div className='travel-content column title-bold'>
                    {title}
                    <IconButton
                        className='travel-button'
                        onClick={handleClick}
                        title='Расходы'
                    />
                </div>
            </div>
        </Swipe>
    )
}