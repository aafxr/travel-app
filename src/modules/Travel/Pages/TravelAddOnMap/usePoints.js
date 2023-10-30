import {useEffect, useRef, useState} from "react";
import useTravelContext from "../../../../hooks/useTravelContext";


/**
 * @function
 * @name usePoints
 * @param {IMap} map
 * @returns {{setPoints: (value: (((prevState: PointType[]) => PointType[]) | PointType[])) => void, points: PointType[]}}
 * @category Hooks
 */
export default function usePoints(map) {
    const {travel} = useTravelContext()
    /** список точек на карте */
    const [points, setPoints] = useState(/**@type{PointType[]} */[])

    /** react ref на последний input элемент, который был в фокусе */
    const lastFocusedElement = useRef(null)

    // начальное значение первой точки =================================================================================
    useEffect(() => {
        if (map) {
            const list = travel.waypoints.length > 0
                ? travel.waypoints
                : [map.newPoint(travel.id)]
            setPoints(list)
        }
    }, [travel, map])

    // слушатель на событие выбора точки с помощью подсказки ===========================================================
    /** при выборе адреса из блока подсказки эмитится событие "selected-point" */
    useEffect(() => {
        const pointSelectHandler = async (e) => {
            if (!map) return
            /** адресс, выбранный пользователем из выпадающего списка подсказок */
            const address = e.detail
            /** обращение к api карты для получения информации о выбранном месте */
            const marker = await map.addMarkerByAddress(address)
            if (marker && lastFocusedElement && lastFocusedElement.current) {
                /** id элемента из массива points, input которого последний раз был в фокусе */
                const id = lastFocusedElement.current.dataset.id

                /** новый массив точек с обновленными данными
                 * @type{PointType[]}
                 */
                const newPoints = points.map(p => {
                    if (p.id === id)
                        return {id, text: marker.textAddress, point: marker}
                    return p
                })
                setPoints(newPoints)
            }
        }

        document.addEventListener('selected-point', pointSelectHandler)
        return () => document.removeEventListener('selected-point', pointSelectHandler)
    }, [])


    return {points, setPoints}
}