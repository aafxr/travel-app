import React from "react";
import {useNavigate} from "react-router-dom";
import Button from "../../../../components/ui/Button/Button";

import './TravelCard.css'
import Swipe from "../../../../components/ui/Swipe/Swipe";

export default function TravelCard({title, onRemove, to}) {
    const navigate = useNavigate()

    function HandleClick(e) {
        e.stopPropagation()
        to && navigate(to)
    }

    function handleRemove(){
        onRemove && onRemove()
    }


    return (
        <Swipe onRemove={handleRemove} rightButton>
            <div className='travel-item gap-1'>
                <div className='travel-image no-resize'>
                    <img className='img-abs' src={process.env.PUBLIC_URL + '/images/travel-placeholder.jpg'}
                         alt='travel'/>
                </div>
                <div className='travel-content column title-bold'>
                    {title}
                    <button
                        className='travel-button'
                        onClick={HandleClick}
                    >
                        Расходы
                    </button>
                </div>
            </div>
        </Swipe>
    )
}