import clsx from "clsx";

import './Avatar.css'

/**
 * компонент отображения аватарки пользователя
 * @param {string} src
 * @param {string} alt
 * @param {string} className css class
 * @returns {JSX.Element}
 * @category Components
 */
export default function Avatar({src, alt, className}){

    return (
        <img className={clsx('avatar', className)} src={src} alt={alt || ""} />
    )
}