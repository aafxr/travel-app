import React, {HTMLAttributes, useEffect, useRef, useState} from "react";

import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {Travel, User, Member} from "../../classes/StoreEntities";
import {PhotoService} from "../../classes/services/PhotoService";
import {DEFAULT_IMG_URL} from "../../static/constants";
import {Photo} from "../../classes/StoreEntities/Photo";

/**
 * @typedef {Object} PhotoType
 * @property {string} id - идентификатор фото
 * @property {Blob} blob - блоб файл с изобрадением
 * @property {string} src - ссылка на фото на удаленном сервере
 */


interface PhotoPropsType extends Omit<HTMLAttributes<HTMLImageElement>, 'onChange'> {
    item: Travel | User | Member,
    onChange?: (photo: Blob) => unknown
}

/**
 * компонент отображает фото по переданному src , либо ищет в бд по id
 * @param  className css class
 * @param  id        идентификатор фото в бд
 * @param  onChange  обработчик на изменение фото
 * @param  props     other props
 * @returns {JSX.Element}
 * @category Components
 */
function PhotoComponent({className, item, onChange, ...props}: PhotoPropsType) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [photo, setPhoto] = useState<Photo>()

    useEffect(() => {
        PhotoService.getById(item.photo)
            .then(p => {if (p) setPhoto(p)})
            .catch(defaultHandleError)

        return () => {
            photo && photo.destroy && photo.destroy()
        }
    }, [])

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        const file = e.target.files[0]
        if (!file) return
        if (photo) {
            const newPhoto = new Photo({id: photo.id, blob: file})

            PhotoService.save(newPhoto)
                .then(() => setPhoto(newPhoto))
                .then(() => onChange && onChange(file))
                .catch(defaultHandleError)

        } else {
            /*** передаем обновленные данные о фото в компонент родитель */
            onChange && onChange(file)
        }
    }

    return (
        <>
            {photo
                ? <img {...props} className={className} src={ photo.src || photo.blobUrl} alt="Фото" onClick={() => inputRef.current?.click()}/>
                :<img {...props} className={className} src={DEFAULT_IMG_URL} alt="Фото" onClick={() => inputRef.current?.click()}/>
            }

            {!!onChange &&
                <input ref={inputRef} type="file" hidden onChange={handlePhotoChange} accept={'image/jpeg,image/png'}/>}
        </>
    )
}

export default React.memo(PhotoComponent)
