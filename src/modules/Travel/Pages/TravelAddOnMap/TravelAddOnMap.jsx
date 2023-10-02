import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import MapPointsInputList from "../../../../components/MapPointsInputList/MapPointsInputList";
import MapControls from "../../../../components/MapControls/MapControls";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import ErrorReport from "../../../../controllers/ErrorReport";
import Button from "../../../../components/ui/Button/Button";
import createAction from "../../../../utils/createAction";
import {PageHeader} from "../../../../components/ui";
import constants, {DEFAULT_PLACEMARK_ICON} from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import createId from "../../../../utils/createId";
import YandexMap from "../../../../api/YandexMap";
import {actions} from "../../../../redux/store";
import useTravel from "../../hooks/useTravel";

import './TravelAddOnMap.css'

/**
 * @typedef {Object} InputPoint
 * @property {string} id
 * @property {string} text
 * @property {Point} point
 */

export default function TravelAddOnMap() {
    const {travelCode} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {travel, errorMessage} = useTravel()
    const {user, userLoc} = useSelector(state => state[constants.redux.USER])
    const {travelID} = useSelector(state => state[constants.redux.TRAVEL])

    /** референс на контайнер карты */
    const mapRef = useRef(/**@type{HTMLDivElement}*/ null)

    /** интерфейс для взаимодействия с картой */
    const [map, setMap] = useState(/**@type{IMap} */ null)

    /** список точек на карте */
    const [points, setPoints] = useState(/**@type{InputPoint[]} */[])

    // const [userCoords, setUserCoords ] = useState([])

    /** react ref на последний input элемент, который был в фокусе */
    const lastFocusedElement = useRef(null)
    /** флаг указывает на то, что точка с координатами пользователя уже добавленна */
    const [fromUserLocation, setFromUserLocation] = useState(false)

    // слушатель на событие выбора точки с помощью подсказки ===========================================================
    /** при выборе адреса из блока подсказки эмитится событие "selected-point" */
    useEffect(() => {
        const pointSelectHandler = async (e) => {
            if (!map) return
            /** адресс, выбранный пользователем из выпадающего списка подсказок */
            const address = e.detail
            /** обращение к api карты для получения информации о выбранном месте */
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

    // если страница обновилась в момент добавления мест на карте, то пользователь перенаправляется заполнять данные заново
    useEffect(() => {
        if (errorMessage) navigate('/travel/add/map/')
    }, [errorMessage])

    // создаем новое путешествие =======================================================================================
    useEffect(() => {
        if (!travelCode) dispatch(actions.travelActions.travelInit(user))
    }, [])

    // начальное значение первой точки =================================================================================
    useEffect(() => {
        setPoints(travel?.waypoints || [{id: createId(user.id), text: '', point: undefined}])
    }, [travel])

    // инициализация карты =============================================================================================
    useEffect(() => {
        if (mapRef.current && !map && travel) {
            /** инициализация карты */
            YandexMap.init({
                api_key: process.env.REACT_APP_API_KEY,
                mapContainerID: 'map',
                iconClass: 'location-marker',
                points: travel.waypoints ? travel.waypoints.map(wp => wp.point) : [],
                location: userLoc,
                iconURL: DEFAULT_PLACEMARK_ICON,
                // suggestElementID: points[0]?.id,
                markerClassName: 'location-marker'
            }).then(newMap => {
                window.map = newMap
                setMap(newMap)
            })
        }

        return () => map && map.destroyMap()
    }, [mapRef.current, map, travel])

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
                setPoints(prev => {
                    return prev.map((p, i) => {
                        if (i === index) return {...p, text: draggedPoint.textAddress, point: draggedPoint}
                        else return p
                    })
                })
            }
        }

        document.addEventListener('drag-point', handleDragPoint)
        return () => document.removeEventListener('drag-point', handleDragPoint)
    }, [])

    // обработка фокуса на input =======================================================================================
    async function handleUserLocationPoint() {
        if (!map) return
        /** попытка получить координаты пользователя */
        const coords = await map.getUserLocation().catch((err) => {
            ErrorReport.sendError(err).catch(console.error)
            pushAlertMessage({type: "warning", message: 'Не удалось определить геолокацию'})
            return null
        })
        console.log('coords', coords)

        if (coords) {
            /** добавление места с координатами пользователя */
            map
                .addMarker(coords)
                .then(point => {
                    const newPoint = {id: createId(user.id), text: point.textAddress, point}
                    const newPoints = [newPoint, ...points]
                    /** перезаписываем массив мест (отфильтровываем пустые поля) */
                    dispatch(actions.travelActions.setWaypoints(newPoints.filter(p => !!p.point)))
                    setPoints(newPoints)
                    setFromUserLocation(true)
                })
        }

    }

    // обработка зума при прокрутки колесика мыши
    function handleWheel(e) {
        if (e.deltaY) {
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
        if (travel) {
            const newTravel = {...travel}
            /** получаем краткое описание направления вида: "новосибирск - бердск" */
            const direction = newTravel.waypoints
                .map(p => p.text)
                .reduce((acc, address) => {
                    let place = address.split(',').filter(pl => !pl.includes('область')).shift() || ''
                    place = place.trim()
                    return acc ? acc + ' - ' + place : place
                }, '')

            newTravel.direction = direction
            /** обновляем поле direction в глобальном хранилище */
            dispatch(actions.travelActions.setDirection(direction))

            storeDB.editElement(constants.store.TRAVEL, newTravel)
                /** запись новой сущности travel в redux store */
                .then(() => dispatch(actions.travelActions.addTravel(newTravel)))
                .then(() => navigate(`/travel/${newTravel.id}/settings/`))
                .catch(console.error)
        }
    }

    // добавление новой точки ==========================================================================================
    function handleAddNewPoint() {
        /** запись всех заполненных полей в текущий travel в store */
        dispatch(actions.travelActions.setWaypoints(points.filter(p => !!p.point)))
        storeDB.editElement(constants.store.TRAVEL, travel)
            /** перенаправление на страницу TravelAddWaypoint */
            .then(() => navigate(`/travel/${travelID}/add/waypoint/`))

    }

    /** обработка изменения списка точек ( добавлена / удалена / переытавленна) */
    function handlePointListChange(newPoints) {
        /** запись всех измененных полей в текущий travel в store */
        dispatch(actions.travelActions.setWaypoints(newPoints))
        setPoints(newPoints)
    }

    if (!travel) return null

    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Направление'}/>
                <div className='column gap-0.5'>
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
                </div>
            </Container>
            <div className='content'>
                <div
                    ref={mapRef}
                    id='map'
                    className='relative'
                    onWheel={handleWheel}
                >
                    <MapControls className='map-controls' map={map}/>
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
