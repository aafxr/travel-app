import {useEffect, useState} from "react";

import useTravelContext from "../../../../hooks/useTravelContext";
import {CloseIcon} from "../../../../components/svg";
import {Input} from "../../../../components/ui";
import ErrorReport from "../../../../controllers/ErrorReport";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import defaultPoint from "../../../../utils/default-values/defaultPoint";
import createId from "../../../../utils/createId";


/**
 * @function
 * @name StartPointInput
 * @param {IMap} map
 * @returns {JSX.Element}
 * @category Components
 */
export default function StartPointInput({  map}) {
    const {travel, update} = useTravelContext()
    const [point, setPoint] = useState(/**@type{PointType} */null)

    useEffect(() => {
        if (travel.isFromPoint) setPoint(travel.fromPoint)
    }, [travel])

    function handleRemoveFromPoint(){
        travel.removeFromPoint()
        map.removePoint(point.id)
        update()
    }

    /**
     * @param {ChangeEvent<HTMLInputElement>} e
     */
    function handleChange(e){
        setPoint({...point, address: e.target.value})

    }

    /**
     * @param {KeyboardEvent<HTMLInputElement>} e
     */
    function handleKeyDownEvent(e){
        if(e.keyCode === 13){
            map.addMarkerByAddress(point.address, point.id)
                .then(p => {
                    if(p){
                        travel.setFromPoint(p)
                        setPoint(p)
                        update()
                    }
                })
        }
    }

    // обработка фокуса на input =======================================================================================
    async function handleUserLocationPoint() {
        if (!map) return
        /** попытка получить координаты пользователя */
        const coords = await map.getUserLocation().catch((err) => {
            ErrorReport.sendError(err).catch(console.error)
            pushAlertMessage({type: "warning", message: 'Не удалось определить геолокацию'})
            return null
        })

        if (coords) {
            const newPoint = defaultPoint(travel.id, {coords})
            const id = newPoint.id
            /** добавление места с координатами пользователя */
            map
                .addPoint(newPoint, {markerType: "exist"})
                .getClosestAddressTo(coords)
                .then(p => {
                    if (p) {
                        p.id = id
                        travel.setFromPoint(p)
                        setPoint(p)
                        update()
                    }
                })
                .catch(console.error)
        }
    }



    return travel.isFromPoint
        ? (
            <div
                onClick={() => {
                }}
                className='travel-map-input-container relative'
                data-id={point?.id}
            >
                <Input value={point?.address} onChange={handleChange} onKeyDown={handleKeyDownEvent} data-id={point?.id}/>
                <CloseIcon
                    className="travel-map-search"
                    onClick={handleRemoveFromPoint}
                />
            </div>
        )
        : (
            <div
                className='link'
                onClick={handleUserLocationPoint}
            >
                + Указать откуда начнется поездка
            </div>
        )
}
