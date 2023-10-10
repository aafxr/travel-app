import {BellIcon, CopyIcon, LinkIcon} from "../svg";
import React from "react";

/**
 * Компонент для отображения дефолтных иконок в меню (копировать / скопировать ссылку / уведомления)
 * @returns {JSX.Element}
 * @category Components
 */
export default function MenuIconList(){
    return (
        <>
            <CopyIcon />
            <LinkIcon />
            <BellIcon />
        </>
    )
}