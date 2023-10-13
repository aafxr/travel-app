import {motion} from "framer-motion";
import {useEffect, useState} from "react";

import ChevronRightIcon from "../svg/ChevronRightIcon";
import {animationVariant} from "./animationVariant";
import range from "../../utils/range";

import './PhotoCarousel.css'

/**
 * Компонент-слайдер
 * @function
 * @name PhotoCarousel
 * @param {number} startValue default = 0, индекс изображения, которое будепервым отображаться
 * @param {string[]} urls default = [], список URL
 * @returns {JSX.Element}
 * @category Components
 */
export default function PhotoCarousel({startValue = 0, urls = []}) {
    /*** индекс текущего отображаемого изображения */
    const [index, setIndex] = useState(0)
    /*** список картинок с индексом (для вычисления направления анимации) */
    const [urlsList, setUrlsList] = useState(/***@type {{idx:number, url:string}[]} */[])

    /*** инициализация начальнлгл индекса отображаемого изображения */
    useEffect(() => {
        if (typeof startValue === "number" && startValue >= 0) setIndex(startValue)
    }, [startValue])

    /*** инициализация списка изображений */
    useEffect(() => {
        if (Array.isArray(urls)) {
            const list = urls.map((url, idx) => ({idx, url}))
            setUrlsList(list)
        }
    }, [urls])

    return (
        <div className='photo-container'>
            {
                urlsList.filter(u => range(index - 3, index + 3).includes(u.idx)).map(u => {
                    const direction = u.idx - index
                    return (
                        <motion.img
                            key={u.idx}
                            className="photo-image img-abs"
                            src={u.url}
                            alt={u.url}
                            initial="enter"
                            animate={direction === 0 ? "center" : "exit"}
                            exit="exit"
                            variants={animationVariant}
                            custom={direction}
                        />
                    )
                })
            }
            {
                Array.isArray(urls) && urls.length > 1 && (
                    <>
                        <button
                            className='photo-button-left rounded-button'
                            onClick={() => setIndex(index - 1)}
                            disabled={index <= 0}
                        >
                            <ChevronRightIcon/>
                        </button>
                        <button
                            className='photo-button-right rounded-button'
                            onClick={() => setIndex(index + 1)}
                            disabled={index >= urls.length - 1}
                        >
                            <ChevronRightIcon/>
                        </button>
                        <span className='photo-index'>{`${index + 1}/${urls.length}`}</span>
                    </>
                )
            }
        </div>
    )
}
