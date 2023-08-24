import {useEffect, useState} from "react";
import storeDB from "../db/storeDB/storeDB";
import constants from "../static/constants";
import isString from "../utils/validation/isString";

export default function useUserInfo(id){
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [photo, setPhoto] = useState(null)

    useEffect(() => {
        storeDB.getOne(constants.store.USERS, id)
            .then(userData => {
                if (userData) {
                    setUser(userData)
                    storeDB.getOne(constants.store.IMAGES, userData.photo)
                        .then(photo => {
                            if (photo) {
                                photo.blob = URL.createObjectURL(photo.blob)
                                setPhoto(photo)
                            }
                            setLoading(false)
                        })
                } else {
                    // обращение к api для загрузки юзер инфо
                }
            })

        return () => photo && isString(photo.blob) && URL.revokeObjectURL(photo.blob)
    }, [])

    return {
        user,
        photo,
        loading
    }
}