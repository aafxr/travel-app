import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import Swipe from "../../../../components/ui/Swipe/Swipe";
import IconButton from "../../../../components/ui/IconButton/IconButton";
import uploadFile from "../../../../utils/file/uploadFile";

import './TravelCard.css'

const defaultImage = process.env.PUBLIC_URL + '/images/travel-placeholder.jpg'
export default function TravelCard({id, title, onRemove, url}) {
    const inputRef = useRef(/**@type{HTMLInputElement}*/null)
    const [imageUrl, setImageUrl] = useState(url || defaultImage)


    const navigate = useNavigate()

    function handleClick(e) {
        e.stopPropagation()
        navigate(`/travel/${id}/expenses/`)
    }

    function handleRemove() {
        onRemove && onRemove()
    }

    function imageClickHandler(/**@type{MouseEvent} */e) {
        e.stopPropagation()
        inputRef.current.click()
    }

    function handleFileChange(e){
        const file = e.target.files[0]
        const url = URL.createObjectURL(file)
        uploadFile(file)
            .then(reader => console.log(reader.result))
            .catch(console.error)
    }


    console.log(imageUrl)
    return (
        <>
            <Swipe
                onRemove={handleRemove}
                rightButton
                onClick={() => navigate(`/travel/${id}/`)}
            >
                <div className='travel-item gap-1'>
                    <div className='travel-image flex-0' onClick={imageClickHandler}>
                        <img
                            className='img-abs'
                            src={imageUrl}
                            alt='travel'

                        />
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
            <input
                ref={inputRef}
                type="file" hidden
                onChange={handleFileChange}
            />
        </>
    )
}