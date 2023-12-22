import {useEffect, useState} from "react";

/**
 * @typedef {Object} DragWaypointType
 * @property {WaypointType} dragPoint
 * @property {number} index - индекс, по которому dragPoint находится в IMap карте
 */

/**
 * хук возвращает последнюю перемещенную точку
 * @returns {DragWaypointType | null}
 */
export default function useDragPoint(){
    const [point, setPoint] = useState(/**@type{DragWaypointType | null} */ null)

    //обработка события drag-point =====================================================================================
    useEffect(() => {
        /**
         * обработчик события перетасивания маркера
         * @param {CustomEvent} e
         */
        const handleDragPoint = (e) => {
            /**
             * информация о точке с которой взаимодействовали и ее индекс в массиве точек возвращаемы интерфейсом IMap
             * @typedef {Object} DragWaypointType
             * @property {WaypointType} point
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