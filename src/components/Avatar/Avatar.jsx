import clsx from "clsx";

import './Avatar.css'

/**
 * компонент отображения аватарки пользователя
 * @param {string} src
 * @param {string} alt
 * @param {string} className
 * @returns {JSX.Element}
 * @constructor
 * @category Components
 * @component
 */
export default function Avatar({src, alt, className}){

    return (
        <img className={clsx('avatar', className)} src={src} alt={alt || ""} />
    )
}