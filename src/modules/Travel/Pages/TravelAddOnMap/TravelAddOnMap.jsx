import {useEffect, useRef, useState} from "react";

import screenCoordsToBlockCoords from "../../../../utils/screenCoordsToBlockCoords";
import MapControls from "../../../../components/MapControls/MapControls";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import YandexMap from "../../../../api/YandexMap";

import './TravelAddOnMap.css'

export default function TravelAddOnMap() {
    const mapRef = useRef(/**@type{HTMLDivElement}*/ null)
    const [map, setMap] = useState(/**@type{IMap}*/ null)
    const [inputValue, setInputValue ] = useState('')

    useEffect(() => {
        if (mapRef.current && !map) {
            YandexMap.init({
                api_key: process.env.REACT_APP_API_KEY,
                mapContainerID: 'map',
                iconClass: undefined,
                points: [],
                suggestElementID: 'waypoint_1',
                markerClassName: 'location-marker'
            }).then(newMap => {
                window.map = newMap
                setMap(newMap)
            })
        }

        return () => map && map.destroyMap()
    }, [mapRef, map])

    //=============================== click handlers ===================================================================
    function handleMapClick(e) {
        const {clientX, clientY, target} = e
        const {x, y} = screenCoordsToBlockCoords(target, clientX, clientY)
        map.addMarkerByLocalCoords([x, y])
    }

    function handleMapTouchEnd(e) {
        const {clientX, clientY, target} = e.changedTouches[0]
        const {x, y} = screenCoordsToBlockCoords(target, clientX, clientY)
        map.addMarkerByLocalCoords([x, y])
    }

    // обработка ввода input ===========================================================================================
    async function handleKeyDown(e){
        if(e.keyCode === 13){
            e.stopPropagation()
            const marker = await map.addMarkerByAddress(inputValue)
            if(marker){
                setInputValue('')
                map.autoZoom() // marker.coords, 14
                console.log(marker)
                console.log(e)
                console.log(e.target.focus)
                e.target.focus()
            } else {
                pushAlertMessage({type:"warning", message: 'не удалось определить адрес'})
            }
        }
    }

    function handleInputChange(e){
        setInputValue(e.target.value)
    }

    // обработка контроллов карты ======================================================================================
    function handleZoomPlus(){
        const zoom = map.getZoom()
        map.setZoom(zoom + 1)
    }

    function handleZoomMinus(){
        const zoom = map.getZoom()
        map.setZoom(zoom - 1)
    }

    async function handleUserLocation(){
        const userCoords = await map.getUserLocation()
        pushAlertMessage({type: "info", message: userCoords ? userCoords.toString() : 'null'})
        if(userCoords){
            map.focusOnPoint(userCoords)
        } else{
            pushAlertMessage({type: 'warning', message: 'Не удалось получить геолокацию устройства'})
        }
    }


    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Направление'}/>
                <Input
                    id='waypoint_1'
                    placeholder='Куда едем?'
                    value={inputValue}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                />
            </Container>
            <div className='content'>
                <div
                    ref={mapRef}
                    id='map'
                    className='relative'
                >
                    <MapControls
                        className='travel-controls'
                        onPlusClick={handleZoomPlus}
                        onMinusClick={handleZoomMinus}
                        onUserLocationClick={handleUserLocation}
                    />
                </div>
            </div>
            <div className='fixed-bottom-button'>
                <Button
                    onClick={() => {
                    }}
                >
                    Продолжить
                </Button>
            </div>
        </div>
    )
}
