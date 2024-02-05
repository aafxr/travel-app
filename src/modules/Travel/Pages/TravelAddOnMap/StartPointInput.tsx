import React, {useEffect, useState} from "react";

import {findByAddress, findByCoordinates} from "../../../../components/YandexMap";
import {WaypointType} from "../../../../types/WaypointType";
import {Waypoint} from "../../../../classes/StoreEntities";
import userLocation from "../../../../utils/userLocation";
import {CloseIcon} from "../../../../components/svg";
import {Input} from "../../../../components/ui";
import defaultHandleError from "../../../../utils/error-handlers/defaultHandleError";


type StartPointInputPropsType = {
    waypoint?: WaypointType
    onChange: (waypoint: WaypointType) => unknown
    onRemove: (waypoint: WaypointType) => unknown
}

/**
 * @function
 * @name StartPointInput
 * @returns {JSX.Element}
 * @category Components
 */
export default function StartPointInput({waypoint, onChange, onRemove}: StartPointInputPropsType) {
    const [wp,setWaypoint] = useState<WaypointType>()

    useEffect(() => {
        if(!waypoint) setWaypoint(new Waypoint({}).dto())
        setWaypoint(waypoint)
    }, [waypoint])


    function handleRemoveFromPoint() {
        if (!wp) return
        onRemove(wp)
    }

    function handleChange(text: string) {
        const address = text.trim()
        if (!address) return
        if (!wp) return
        const w = {...wp, address}
        setWaypoint(w)
        onChange(w)

    }


    function handleKeyDownEvent(e: React.KeyboardEvent<HTMLInputElement>) {
        if(!wp) return
        if (e.key === 'Enter') {
            findByAddress(wp.address)
                .then(response => {
                    if('address' in response){
                        const address = response.address
                        const coords = response.boundedBy[0]
                        const locality = response.description
                        const newPoint = {...wp, address, coords, locality}
                        onChange(newPoint)
                    }
                })
                .catch(console.error)
        }
    }



    // обработка фокуса на input =======================================================================================
    async function handleUserLocationPoint() {
        if(!wp) return
        const coords = await userLocation()


        if (coords) {
            await findByCoordinates(coords)
                .then(response => {
                    if('address' in response){
                        const address = response.address
                        const coords = response.boundedBy[0]
                        const newPoint = {...wp, address, coords}
                        onChange(newPoint)
                    }
                })
                .catch(defaultHandleError)
        }
    }

    if (waypoint && wp)
        return (
            <div
                onClick={() => {}}
                className='travel-map-input-container relative'
                data-id={wp.id}
            >
                <Input className={'input'} value={wp.address} onChange={handleChange}
                       onKeyDown={handleKeyDownEvent} data-id={wp.id}/>
                <CloseIcon className="travel-map-search" onClick={handleRemoveFromPoint}/>
            </div>
        )


    return (
        <div className='link' onClick={handleUserLocationPoint}>
            + Указать откуда начнется поездка
        </div>
    )
}
