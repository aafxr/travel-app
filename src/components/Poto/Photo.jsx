import React, {useEffect, useRef, useState} from "react";

import constants, {DEFAULT_IMG_URL} from "../../static/constants";
import storeDB from "../../db/storeDB/storeDB";
import createId from "../../utils/createId";

/**
 * @typedef {Object} UserPhotoType
 * @property {string} id - идентификатор фото
 * @property {Blob} blob - блоб файл с изобрадением
 * @property {string} src - ссылка на фото на удаленном сервере
 */
/**
 * @typedef {Function} PhotoChangeFunction
 * @param {UserPhotoType} photo
 */


/**
 * компонент отображает фото по переданному src , либо ищет в бд по id
 * @param {string} className
 * @param {string} id                       идентификатор фото в бд
 * @param {PhotoChangeFunction} onChange    обработчик на изменение фото
 * @param props
 * @returns {JSX.Element}
 * @category Components
 */
export default function Photo({className, id, onChange, ...props}) {
    const [photo, setPhoto] = useState(/**@type{UserPhotoType | null} */null)
    const [photoURL, setPhotoURL] = useState('')
    const inputRef = useRef(/**@type{HTMLInputElement}*/null)

    /** загругка фото из по предоставленному ID */
    useEffect(() => {
        if (id) {
            storeDB.getOne(constants.store.IMAGES, id)
                .then( /** @param{UserPhotoType | undefined} p*/p => {
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
                        /** в приоритете устанавливается url из поля src, если поля нет, то ссылка сощдается на blob */
                        setPhotoURL(url)
                    }
                })
        }
        return () => photoURL && URL.revokeObjectURL(photoURL)
    }, [id])


    function handlePhotoChange(/**@type{ChangeEvent<HTMLInputElement>} */e) {
        const file = e.target.files[0]
        if (file) {
            /**@type {UserPhotoType} */
            const userPhoto = {
                id: photo?.id || createId(),
                blob: file,
                src: ''
            }
            /** освобождение ресурсов выделенных для фото */
            photoURL && URL.revokeObjectURL(photoURL)
            /** ссылка на новое изображение */
            const newURL = URL.createObjectURL(userPhoto.blob)
            setPhotoURL(newURL)
            /** передаем обновленные данные о фото в компонент родитель */
            onChange && onChange(userPhoto)
        }
    }

    return (
        <>
            <img {...props} className={className} src={photoURL || DEFAULT_IMG_URL} alt="Фото"
                 onClick={e => inputRef.current?.click()}/>
            {!!onChange && <input ref={inputRef} type="file" hidden onChange={handlePhotoChange} accept={'image/*'}/>}
        </>
    )
}