import PlayIcon from "../svg/PlayIcon";

import './AudioBtn.css'

/**
 * компонент отображения кнопки аудио
 * @returns {JSX.Element}
 * @constructor
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