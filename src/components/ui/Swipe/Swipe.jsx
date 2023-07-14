import React, {useState} from "react";

import './Swipe.css'


export default function Swipe({children, className,onClick, onRemove, onConfirm, marginMax = 60, ...props}) {
    const [marginLeft, setMarginLeft] = useState(0)
    const [touchStartX, setTouchStartX] = useState(0)


    function handleTouchStart(touchStartEvent) {

        const touch = touchStartEvent.touches[0];
        setTouchStartX(touch.pageX);

        console.dir(touchStartEvent);
    }

    function handleTouchMove(touchMoveEvent) {
        const touch = touchMoveEvent.touches[0];
        let x = touch.pageX - touchStartX;
        if (x > marginMax) {
            x = marginMax
        }
        if (x < -marginMax) {
            x = -marginMax
        }
        setMarginLeft(x);

        //console.dir(touchMoveEvent);
    }

    function handleTouchEnd() {
        if (marginLeft > 30) {
            // setVisited((prevState) => !prevState);
        }
        if (marginLeft > 0) {
            setMarginLeft(0)
        }
        ;
    }

    function handleBlockClick() {
        setMarginLeft(0);

    }

    return (
        <div className='swiper-container flex-between'>
            <div className='swiper-button center'>
                <img src={process.env.PUBLIC_URL + '/icons/check.svg'} alt="check"/>
            </div>
            <div className='swiper-button center'>
                <img src={process.env.PUBLIC_URL + '/icons/trash.svg'} alt="trash"/>
            </div>
            <div
                className='swipe-item'
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={handleBlockClick}
                style={{
                    marginLeft: marginLeft + 'px',
                }}
            >
                {children}
            </div>
        </div>
    )

}