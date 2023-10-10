import {useEffect, useRef, useState} from "react";

import './InfoBlock.css'


/**.
 * Компонент представляет собой текстовый блок с возможностью скрывать часть текста
 * @param {string} title заголовок блока
 * @param {string} description контент блока
 * @param {React.ReactNode} children
 * @param {number} lineNumber число отображаемых строк параметра "description"
 * @returns {JSX.Element}
 * @category Components
 */
export default function InfoBlock({title, description, children, lineNumber = 3}) {
    const [full, setFull] = useState(false)
    // line-height  of description block
    const [lh, setLh] = useState(0)
    const descrRef = useRef(/**@type{HTMLDivElement} */null)

    useEffect(() => {
        if (descrRef.current) {
            const styles = window.getComputedStyle(descrRef.current)
            const lineHeight = styles.getPropertyValue('line-height')
            const height = parseFloat(lineHeight)
            if (!Number.isNaN(height)) {
                setLh(height)
            }
        }
    }, [])

    useEffect(() =>{
        if (descrRef.current){
            descrRef.current.style.maxHeight = lh * lineNumber + 'px'
        }
    }, [lh, lineNumber])

    return (
        <div>
            <div className='info-block-title title-bold'>{title}</div>
            <div ref={descrRef} className='info-block-description'>
                {description}
                {children}
                    <span
                        className='link'
                        onClick={() => setFull(!full)}
                    >
                    &nbsp;{full ? 'Свернуть' : 'Еще' }
                    </span>
            </div>
        </div>
    )
}