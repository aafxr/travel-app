import {useEffect, useState} from "react";
import constants from "../static/constants";
import storeDB from "../db/storeDB/storeDB";

/**
 * @param {string} value
 */
export default function usePhoto(value){
    const [photoURL, setPhotoURL] = useState('')

    useEffect(() => {
        if (value instanceof Blob){
            const newURL = URL.createObjectURL(value)
            setPhotoURL(newURL)
        }else if (typeof value === 'string'){
            storeDB.getOne(constants.store.IMAGES, value)
                .then(p => {
                    if(p){
                        const newURL = p.src || URL.createObjectURL(p.blob)
                        photoURL && URL.revokeObjectURL(photoURL)
                        setPhotoURL(newURL)
                    }
                })
        }
        return () => URL.revokeObjectURL(photoURL)
    }, [value])

    return photoURL
}