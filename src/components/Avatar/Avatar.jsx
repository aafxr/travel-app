import clsx from "clsx";

import './Avatar.css'

export default function Avatar({src, alt, className}){

    return (
        <img className={clsx('avatar', className)} src={src} alt={alt || ""} />
    )
}