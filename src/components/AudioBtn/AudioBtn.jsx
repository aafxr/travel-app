import {PlayIcon} from "../svg";

import './AudioBtn.css'

/**
 * компонент отображения кнопки аудио
 * @returns {JSX.Element}
 * @category Components
 */
export default function AudioBtn(){

    return (
        <>
            <button className='audio-btn'>
                <span className='audio-btn-icon'>
                    <PlayIcon />
                </span>
                <span className='title-bold'>Аудиогид</span>
            </button>
            <audio hidden />
        </>
    )
}