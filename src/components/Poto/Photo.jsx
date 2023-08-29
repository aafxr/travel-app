import React, {useEffect, useRef, useState} from "react";

import constants, {DEFAULT_IMG_URL} from "../../static/constants";
import storeDB from "../../db/storeDB/storeDB";
import createId from "../../utils/createId";

export default function Photo({id, onChange}) {
    const [photo, setPhoto] = useState(null)
    const [photoURL, setPhotoURL] = useState('')
    const inputRef = useRef(/**@type{HTMLInputElement}*/null)

    useEffect(() => {
        if (id) {
            storeDB.getOne(constants.store.IMAGES, id)
                .then(p => {
                    if (p) {
                        setPhoto(p)
                        let url
                        if (p.src) {
                            url = p.src
                        } else if (p.blob) {
                            url = URL.createObjectURL(p.blob)
                        } else {
                            url = ''
                        }
                        setPhotoURL(url)
                    }
                })
        }
        return () => photoURL && URL.revokeObjectURL(photoURL)
    }, [id])


    function handlePhotoChange(/**@type{ChangeEvent<HTMLInputElement>} */e) {
        const file = e.target.files[0]
        if (file) {
            const userPhoto = {
                id: photo?.id || createId(),
                blob: file,
                src: ''
            }
            photoURL && URL.revokeObjectURL(photoURL)
            const newURL = URL.createObjectURL(userPhoto.blob)
            setPhotoURL(newURL)
            onChange && onChange(userPhoto)
        }
    }

    return (
        <>
            <img className='photo' src={photoURL || DEFAULT_IMG_URL} alt="Фото"
                 onClick={e => inputRef.current?.click()}/>
            {!!onChange && <input ref={inputRef} type="file" hidden onChange={handlePhotoChange} accept={'image/*'}/>}
        </>
    )
}