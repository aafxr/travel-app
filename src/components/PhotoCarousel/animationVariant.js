/**
 * эти опции используются библиотекой framer-motion ля анимации css свойств элемента
 *
 *
 * __direction__ - направление анимации
 * - direction < 0 - на лево
 * - direction > 0 на право
 * @type {{exit: (function(*): {x: number, opacity: number}), center: {x: number, opacity: number}, enter: (function(*): {x: number, opacity: number})}}
 * @category Constants
 * @name animationVariant
 */
export const animationVariant = {
    enter: (direction) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }
    },
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => {
        return {
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }
    },
}