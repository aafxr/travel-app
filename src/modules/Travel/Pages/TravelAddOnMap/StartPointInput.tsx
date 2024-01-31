import {useEffect, useState} from "react";

import useTravelContext from "../../../../hooks/useTravelContext";
import {CloseIcon} from "../../../../components/svg";
import {Input} from "../../../../components/ui";
import ErrorReport from "../../../../controllers/ErrorReport";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import defaultPoint from "../../../../utils/default-values/defaultPoint";
import createId from "../../../../utils/createId";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";


/**
 * @function
 * @name StartPointInput
 * @param {IMap} map
 * @returns {JSX.Element}
 * @category Components
 */
export default function StartPointInput({  map}) {
    const {travel, update, travelObj} = useTravelContext()
    const [point, setPoint] = useState(/**@type{WaypointType} */null)

    useEffect(() => {
        if (travelObj.isFromPoint) setPoint(travelObj.waypoints[0])
    }, [travelObj])

    function handleRemoveFromPoint(){
        travel.removeFromPoint()
        map.removePoint(point.id)
        map.showPolyRoute(travelObj.places,{})
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
            findByAddres()
        }
    }

    function findByAddres(){
        map.getPointByAddress(point.address)
            .then(/**@param{GeoObjectPropertiesType[]} markerInfo*/markerInfo => {
                if (markerInfo) {
                    const {text: address,boundedBy : coords } = markerInfo[0]
                    const kind = markerInfo[0].metaDataProperty.GeocoderMetaData.kind
                    const newPoint = {...point, address, coords: coords[0], kind }

                    travel.setFromPoint(newPoint)
                    setPoint(newPoint)
                    update()
                }
            })
    }

    // обработка фокуса на input =======================================================================================
    async function handleUserLocationPoint() {

        if (!map) return
        /** попытка получить координаты пользователя */
        const coords = await map.getUserLocation().catch((err) => {
            defaultHandleError(err)
            pushAlertMessage({type: "warning", message: 'Не удалось определить геолокацию'})
        })


        if (coords) {
            const newPoint = defaultPoint(travelObj.id, {coords})
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

    return travelObj.isFromPoint
        ? (
            <div
                onClick={() => {
                }}
                className='travel-map-input-container relative'
                data-id={point?.id}
            >
                <Input className={'input'} value={point?.address} onChange={handleChange} onKeyDown={handleKeyDownEvent} data-id={point?.id}/>
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
