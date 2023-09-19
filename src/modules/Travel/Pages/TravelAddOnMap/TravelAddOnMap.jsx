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
import sleep from "../../../../utils/sleep";

import './TravelAddOnMap.css'

/**
 * @typedef {Object} InputPoint
 * @property {string} id
 * @property {string} text
 */

export default function TravelAddOnMap() {
    const {user} = useSelector(state => state[constants.redux.USER])

    /** референс на контайнер карты */
    const mapRef = useRef(/**@type{HTMLDivElement}*/ null)

    /** интерфейс для взаимодействия с картой */
    const [map, setMap] = useState(/**@type{IMap} */ null)

    /** список точек на карте */
    const [points, setPoints] = useState(/**@type{InputPoint[]} */[])

    // const [userCoords, setUserCoords ] = useState([])

    /** переменная для хранения информации о draggingPoint и dragOverPoint */
    const drag = useRef({})

    /** clone - react ref  на HTMLElement, который планируем перетаскивать */
    const clone = useRef(null)

    /** react ref, содержит поля top, right (смещение относительно верхнего правого угда элемента)*/
    const offset = useRef(null)

    /** react ref на последний input элемент, который был в фокусе */
    const lastFocusedElement = useRef(null)

    const [fromUserLocation, setFromUserLocation] = useState(false)

    // слушатель на событие выбора точки с помощью подсказки ===========================================================
    useEffect(() => {
        const pointSelectHandler = async (e) => {
            if (!map) return

            const address = e.detail
            console.log('address', address)

            const marker = await map.addMarkerByAddress(address)
            if (marker) {
                const id = lastFocusedElement.current.dataset.id
                const newPoints = points.map(p => {
                    if (p.id === id) {
                        return {id, text: marker.textAddress}
                    }
                    return p
                })
                setPoints(newPoints)
            }
        }

        document.addEventListener('point', pointSelectHandler)
        return () => document.removeEventListener('point', pointSelectHandler)
    }, [])

    // начальное значение первой точки =================================================================================
    useEffect(() => {
        if (user) setPoints([{id: user.id, text: ''}])
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
    /**
     * обработчик добавляет точку по клику по карте
     * @param {MouseEvent} e
     */
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
    /**
     * при нажатии Enter (keyCode = 13) добавляет точку на карту
     * @param {KeyboardEvent<HTMLInputElement>} e
     * @param item - элемент из массива points
     * @returns {Promise<void>}
     */
    async function handleKeyDown(e, item) {
        if (e.keyCode === 13) {
            const marker = await map.addMarkerByAddress(item.text)
            if (marker) {
                /** обновляем адресс в массиве points по полученным данным от api карты */
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

    /**
     * обработка input event
     * @param {InputEvent} e
     * @param item - элемент из массива points
     */
    function handleInputChange(e, item) {
        const newPoints = points.map(p => {
            if (p === item) return {...item, text: e.target.value}
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
            console.log(userCoords)
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
        drag.current.draggingPoint = item
    }

    /**
     * @param item - точка, которую перетаскивали
     */
    function handleDragEnd(item) {
        /**
         * индекс перетаскиваемого элемента
         * @type {number}
         */
        const draggingIDX = points.findIndex(p => !!drag.current.draggingPoint && p.id === drag.current.draggingPoint.id)
        /**
         * индекс элемента, на который навели
         * @type {number}
         */
        const overIDX = points.findIndex(p => !!drag.current.draggOverPoint && p.id === drag.current.draggOverPoint.id)
        /**  если оба индекса существуют ( индексы !== -1), то меняем элементы местами */
        if (~draggingIDX && ~overIDX) {
            const newPoints = points.map((p, i, arr) => {
                if (i === draggingIDX) return arr[overIDX]
                if (i === overIDX) return arr[draggingIDX]
                return p
            })
            /**
             * логика по устаноке нового порядка точек на карте ...
             */
            drag.current = {}
            setPoints(newPoints)
        }
    }


    function handleDragOver(item) {
        drag.current.draggOverPoint = item
    }

    function handleDragLeave(item) {
    }


    function handleTouchStart(e, item) {
        document.documentElement.classList.add('disable-reload')
        const el = e.target.closest('.travel-map-input-container')
        if (el) {
            const elRect = el.getBoundingClientRect()
            /** создаем копию элемента */
            clone.current = cloneNode(el)
            document.body.appendChild(clone.current)

            const {clientX, clientY} = e.changedTouches[0]
            /** смещение относительно правого верхнего угла блока-контейнерв */
            const top = clientY - elRect.top - elRect.height
            /** смещение относительно правого верхнего угла блока-контейнерв */
            const right = clientX - elRect.left - elRect.width
            offset.current = {top, right}
        }
        handleDragStart(item)
    }

    /**
     * обработчик для позиционирования клона перемещаемого объекта
     * @param {TouchEvent} e
     */
    function handleTouchMove(e) {
        if (clone.current) {
            const {clientX, clientY} = e.changedTouches[0]
            clone.current.style.right = window.innerWidth - clientX + (offset.current?.right || 0) + 'px'
            clone.current.style.top = clientY + (offset.current?.top || 0) + 'px'
        }
    }

    function handleTouchEnd(e, p) {
        if (clone.current) clone.current.remove()

        document.documentElement.classList.remove('disable-reload')
        const {clientX, clientY} = e.changedTouches[0]
        /** поиск обертки input элемента  */
        const container = document.elementFromPoint(clientX, clientY)?.closest('.travel-map-input-container')
        if (container) {
            /** достаем id  из data-атрибута id */
            const pointID = container.dataset.id
            const point = points.find(p => p.id === pointID)
            if (point) {
                drag.current.draggOverPoint = point
                handleDragEnd(point)
            }
        }
    }


    // обработка фокуса на input =======================================================================================
    /**
     * @param {FocusEvent} e
     * @param item
     */
    function handleFocus(e, item) {
        map.setSuggestsTo(item.id)
        lastFocusedElement.current = e.target
    }

    function handleBlur(e, item) {
        map.removeSuggest()
    }

    async function handleUserLocationPoint() {
        const coords = await map.getUserLocation()
        console.log('coords', coords)
        map
            .addMarker(coords)
            .then(point => {
                console.log(point)
                const newPoint = {id: createId(user.id), text: point.textAddress}
                setPoints([newPoint, ...points])
                setFromUserLocation(true)
            })
    }

    // обработка зума при прокрутки колесика мыши
    function handleWheel(e) {
        if (e.deltaY) {
            e.preventDefault()
            const zoom = map.getZoom()
            if (e.deltaY < 0) {
                map.setZoom(zoom + 1)
            } else {
                map.setZoom(zoom - 1)
            }
        }
    }

    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Направление'}/>
                {
                    !fromUserLocation && (
                        <div
                            className='link'
                            onClick={handleUserLocationPoint}
                        >
                            + Текущая позиция
                        </div>
                    )
                }
                {
                    points.map(p => (
                        <div
                            key={p.id}
                            onClick={() => {
                            }}
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
                                onFocus={(e) => handleFocus(e, p)}
                                onBlur={(e) => handleBlur(e, p)}
                            />
                            <div
                                className='travel-map-drag-icon'
                                onClick={() => {
                                }}
                                onTouchStart={(e) => handleTouchStart(e, p)}
                                onTouchEnd={(e) => handleTouchEnd(e, p)}
                                onTouchMove={handleTouchMove}
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
                    onWheel={handleWheel}
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
                    disabled={!points.length}
                >
                    Продолжить
                </Button>
            </div>
        </div>
    )
}

/**
 * возвращает полную копию переданного элмента
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
function cloneNode(el) {
    if (!el) return null

    const elRect = el.getBoundingClientRect()
    const clone = el.cloneNode(true)
    clone.style.opacity = 0.7
    clone.style.position = 'fixed'
    clone.style.overflow = 'hidden'
    clone.style.zIndex = 1000
    clone.style.width = elRect.width + 'px'
    clone.style.height = elRect.height + 'px'

    return clone
}
