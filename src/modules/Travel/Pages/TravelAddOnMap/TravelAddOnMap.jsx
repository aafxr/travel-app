import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";

import screenCoordsToBlockCoords from "../../../../utils/screenCoordsToBlockCoords";
import MapControls from "../../../../components/MapControls/MapControls";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import DragIcon from "../../../../components/svg/DragIcon";
import constants from "../../../../static/constants";
import createId from "../../../../utils/createId";
import YandexMap from "../../../../api/YandexMap";

import './TravelAddOnMap.css'
import sleep from "../../../../utils/sleep";

/**
 * @typedef {Object} InputPoint
 * @property {string} id
 * @property {string} text
 */

export default function TravelAddOnMap() {
    const {user} = useSelector(state => state[constants.redux.USER])
    //референс на контайнер карты
    const mapRef = useRef(/**@type{HTMLDivElement}*/ null)
    // интерфейс для взаимодействия с картой
    const [map, setMap] = useState(/**@type{IMap}*/ null)
    // список точек на карте
    const [points, setPoints] = useState(/**@type{InputPoint[]} */[])
    // const [userCoords, setUserCoords ] = useState([])
    const [draggingPoint, setDraggingPoin] = useState(null)
    const [dragOverPoint, setDraggOverPoin] = useState(null)

    // начальное значение первой точки =================================================================================
    useEffect(() => {
        if (user) {
            setPoints([{id: user.id, text: ''}])
        }
    }, [user])

    // инициализация карты =============================================================================================
    useEffect(() => {
        if (mapRef.current && !map) {
            YandexMap.init({
                api_key: process.env.REACT_APP_API_KEY,
                mapContainerID: 'map',
                iconClass: 'location-marker',
                points: [],
                suggestElementID: points[0]?.id,
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
    async function handleKeyDown(e, item) {
        if (e.keyCode === 13) {
            const marker = await map.addMarkerByAddress(item.text)
            if (marker) {
                const newPoints = points.map(p => {
                    if (p === item) {
                        return {...item, text: marker.textAddress}
                    }
                    return p
                })
                setPoints(newPoints)
            } else {
                pushAlertMessage({type: "warning", message: 'не удалось определить адрес'})
            }
        }
    }

    function handleInputChange(e, item) {
        const newPoints = points.map(p => {
            if (p === item) {
                return {...item, text: e.target.value}
            }
            return p
        })
        setPoints(newPoints)
    }

    // обработка контроллов карты ======================================================================================
    function handleZoomPlus() {
        const zoom = map.getZoom()
        map.setZoom(zoom + 1)
    }

    function handleZoomMinus() {
        const zoom = map.getZoom()
        map.setZoom(zoom - 1)
    }

    async function handleUserLocation() {
        const userCoords = await map.getUserLocation()
        if (userCoords) {
            map.focusOnPoint(userCoords)
        } else {
            pushAlertMessage({type: 'warning', message: 'Не удалось получить геолокацию устройства'})
        }
    }

    // добавление новой точки ==========================================================================================
    function handleAddNewPoint() {
        const newPoint = {
            id: createId(user.id),
            text: ''
        }
        setPoints([...points, newPoint])
        sleep(100).then(() => map.resize())
    }

    // обработка перетаскивания ========================================================================================
    function handleDragStart(item) {
        setDraggingPoin(item)
    }

    function handleDragEnd(item) {
        const draggingIDX = points.findIndex(p => p === draggingPoint)
        const overIDX = points.findIndex(p => p === dragOverPoint)
        if (~draggingIDX && ~overIDX) {
            const newPoints = points.map((p, i, arr) => {
                if (i === draggingIDX) return arr[overIDX]
                if (i === overIDX) return arr[draggingIDX]
                return p
            })
            /**
             * логика по устаноке нового порядка точек на карте ...
             */
            setPoints(newPoints)
            setDraggingPoin(null)
            setDraggOverPoin(null)
        }
    }

    function handleDragOver(item) {
        setDraggOverPoin(item)
    }

    function handleDragLeave(item) {
    }

    function handleTouchStart(p) {
        handleDragStart(p)
    }

    function handleTouchEnd(e, p) {
        console.log(e)
        const {clientX, clientY} = e.changedTouches[0]
        const container = document.elementFromPoint(clientX, clientY)?.closest('.travel-map-input-container')
        console.log(container)
        if (container) {
            const pointID = container.dataset.id
            const point = points.find(p => p.id === pointID)
            if(point){
                setDraggOverPoin(point)
                handleDragEnd(point)
            }
        }
    }


    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Направление'}/>
                {
                    points.map(p => (
                        <div
                            key={p.id}
                            onClick={()=>{}}
                            className='travel-map-input-container relative'
                            onDragOver={() => handleDragOver(p)}
                            onDragLeave={() => handleDragLeave(p)}
                            data-id={p.id}
                        >
                            <Input
                                id={p.id}
                                className='travel-map-input'
                                placeholder='Куда едем?'
                                value={p.text}
                                onKeyDown={(e) => handleKeyDown(e, p)}
                                onChange={(e) => handleInputChange(e, p)}
                                onFocus={() => map.setSuggestsTo(p.id)}
                            />
                            <div
                                className='travel-map-drag-icon'
                                onTouchStart={() => handleTouchStart(p)}
                                onTouchEnd={(e) => handleTouchEnd(e, p)}
                                onDragStart={() => handleDragStart(p)}
                                onDragEnd={() => handleDragEnd(p)}
                                draggable
                            >
                                <DragIcon/>
                            </div>
                        </div>
                    ))
                }

                <div
                    className='link'
                    onClick={handleAddNewPoint}
                >+ Добавить точку маршрута
                </div>
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
