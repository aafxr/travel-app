import React, {HTMLAttributes, useRef} from "react";

import {DEFAULT_IMG_URL} from "../../static/constants";

/**
 * @typedef {Object} PhotoType
 * @property {string} id - идентификатор фото
 * @property {Blob} blob - блоб файл с изобрадением
 * @property {string} src - ссылка на фото на удаленном сервере
 */


interface PhotoPropsType extends Omit<HTMLAttributes<HTMLImageElement>, 'onChange'> {
    src: string,
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
export default function Photo({className, src, onChange, ...props}: PhotoPropsType) {
    const inputRef = useRef<HTMLInputElement>(null)

    function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return

        const file = e.target.files[0]

        /*** передаем обновленные данные о фото в компонент родитель */
        onChange && onChange(file)
    }

    return (
        <>
            <img {...props} className={className} src={src || DEFAULT_IMG_URL} alt="Фото"
                 onClick={e => inputRef.current?.click()}/>
            {!!onChange && <input ref={inputRef} type="file" hidden onChange={handlePhotoChange} accept={'image/*'}/>}
        </>
    )
}