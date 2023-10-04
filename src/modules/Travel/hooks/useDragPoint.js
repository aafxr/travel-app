import {useEffect, useState} from "react";

/**
 * @typedef {Object} DragPointType
 * @property {Point} dragPoint
 * @property {number} index - индекс, по которому dragPoint находится в IMap карте
 */

/**
 * хук возвращает последнюю перемещенную точку
 * @returns {DragPointType | null}
 */
export default function useDragPoint(){
    const [point, setPoint] = useState(/**@type{DragPointType | null} */ null)

    //обработка события drag-point =====================================================================================
    useEffect(() => {
        /**
         * обработчик события перетасивания маркера
         * @param {CustomEvent} e
         */
        const handleDragPoint = (e) => {
            /**
             * информация о точке с которой взаимодействовали и ее индекс в массиве точек возвращаемы интерфейсом IMap
             * @typedef {Object} DragPointType
             * @property {Point} point
             * @property {number} index
             */
            const {point: draggedPoint, index} = e.detail
            /** обновление соответствующей точки в массиве точек (мест) */
            if (draggedPoint) {
                setPoint({dragPoint: draggedPoint, index})
            }
        }

        document.addEventListener('drag-point', handleDragPoint)
        return () => document.removeEventListener('drag-point', handleDragPoint)
    }, [])

    return point
}