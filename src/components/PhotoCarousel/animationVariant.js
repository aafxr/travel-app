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
            x: direction > 0 ? '-100%' : '100%',
            opacity: 0,
            transition: {type: "Inertia"}
        }
    },
    center: {
        x: 0,
        opacity: 1,
        transition: {type: "Inertia"}
    },
    exit: (direction) => {
        return {
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            transition: {type: "Inertia"}
        }
    },
}