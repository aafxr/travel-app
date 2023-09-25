import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import MapControls from "../../../../components/MapControls/MapControls";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import { PageHeader} from "../../../../components/ui";
import MapPointsInputList from "../../../../components/MapPointsInputList/MapPointsInputList";
import screenCoordsToBlockCoords from "../../../../utils/screenCoordsToBlockCoords";
import createAction from "../../../../utils/createAction";
import createTravel from "../../helpers/createTravel";
import constants from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import createId from "../../../../utils/createId";
import YandexMap from "../../../../api/YandexMap";
import {actions} from "../../../../redux/store";
import sleep from "../../../../utils/sleep";

import './TravelAddOnMap.css'

/**
 * @typedef {Object} InputPoint
 * @property {string} id
 * @property {string} text
 * @property {Point} point
 */

export default function TravelAddOnMap() {
    const {user} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
    /** при выборе адреса из блока подсказки эмитится событие "selected-point" */
    useEffect(() => {
        const pointSelectHandler = async (e) => {
            if (!map) return

            const address = e.detail
            const marker = await map.addMarkerByAddress(address)
            if (marker) {
                /** id элемента из массива points, input которого последний раз был в фокусе */
                const id = lastFocusedElement.current.dataset.id

                /** новый массив точек с обновленными данными
                 * @type{InputPoint[]}
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

    // начальное значение первой точки =================================================================================
    useEffect(() => {
        if (user) setPoints([{id: createId(user.id), text: '', point: undefined}])
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
    // function handleMapClick(e) {
    //     const {clientX, clientY, target} = e
    //     const {x, y} = screenCoordsToBlockCoords(target, clientX, clientY)
    //     map.addMarkerByLocalCoords([x, y])
    // }
    //
    // function handleMapTouchEnd(e) {
    //     const {clientX, clientY, target} = e.changedTouches[0]
    //     const {x, y} = screenCoordsToBlockCoords(target, clientX, clientY)
    //     map.addMarkerByLocalCoords([x, y])
    // }

    //обработка события drag-point =====================================================================================
    useEffect(() => {
        const handleDragPoint = (e) => {
            const {point: draggedPoint, index} = e.detail
            if (draggedPoint) {
                setPoints(prev => {
                    return prev.map((p, i) =>{
                        if(i === index){
                            return {...p, text: draggedPoint.textAddress, point: draggedPoint}
                        } else{
                            return p
                        }
                    })
                } )
            }
        }

        document.addEventListener('drag-point', handleDragPoint)
        return () => document.removeEventListener('drag-point', handleDragPoint)
    }, [])

    // обработка фокуса на input =======================================================================================
    async function handleUserLocationPoint() {
        const coords = await map.getUserLocation()
        console.log('coords', coords)
        map
            .addMarker(coords)
            .then(point => {
                console.log(point)
                const newPoint = {id: createId(user.id), text: point.textAddress, point}
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

    //==================================================================================================================
    /** добавление маршрута с заданными местами для посещения */
    function handleRouteSubmit() {
        // const travelPoints = createTravelPoints(travel.id, points)
        const travelPoints = map.getMarkers().map(p => {
            delete p.placemark
            return p
        })
        const travel = createTravel('', user.id, {waypoints: travelPoints})
        const action = createAction(constants.store.TRAVEL, user.id, 'add', travel)

        /** запись в бд новой сущности travel и добавление соответствующего action */
        Promise.all([
            storeDB.addElement(constants.store.TRAVEL, travel),
            storeDB.addElement(constants.store.TRAVEL_ACTIONS, action)
        ])
            /** запись новой сущности travel в redux store */
            .then(() => dispatch(actions.travelActions.addTravels(travel)))
            .then(() => navigate('/'))
            .catch(console.error)
    }

    //=============================== click handlers ===================================================================
    /**
     * обработчик добавляет точку по клику по карте
     * @param {MouseEvent} e
     */
    // function handleMapClick(e) {
    //     const {clientX, clientY, target} = e
    //     const {x, y} = screenCoordsToBlockCoords(target, clientX, clientY)
    //     map.addMarkerByLocalCoords([x, y])
    // }
    //
    // function handleMapTouchEnd(e) {
    //     const {clientX, clientY, target} = e.changedTouches[0]
    //     const {x, y} = screenCoordsToBlockCoords(target, clientX, clientY)
    //     map.addMarkerByLocalCoords([x, y])
    // }

    // добавление новой точки ==========================================================================================
    function handleAddNewPoint() {
        navigate('/travel/add/waypoint/')
    }

    function handlePointListChange(newPoints){
        setPoints(newPoints)
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
                <MapPointsInputList
                    map={map}
                    pointsList={points}
                    onListChange={handlePointListChange}
                />
                <div
                    className='link'
                    onClick={handleAddNewPoint}
                >
                    + Добавить точку маршрута
                </div>
            </Container>
            <div className='content'>
                <div
                    ref={mapRef}
                    id='map'
                    className='relative'
                    onWheel={handleWheel}
                >
                    <MapControls className='map-controls' map={map} />
                </div>
            </div>
            <div className='fixed-bottom-button'>
                <Button
                    onClick={handleRouteSubmit}
                    disabled={!map || !map.getMarkers().length}
                >
                    Продолжить
                </Button>
            </div>
        </div>
    )
}
