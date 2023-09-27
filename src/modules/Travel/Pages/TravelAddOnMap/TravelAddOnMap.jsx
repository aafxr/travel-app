import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import MapPointsInputList from "../../../../components/MapPointsInputList/MapPointsInputList";
import MapControls from "../../../../components/MapControls/MapControls";
import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import createAction from "../../../../utils/createAction";
import {PageHeader} from "../../../../components/ui";
import constants from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import createId from "../../../../utils/createId";
import YandexMap from "../../../../api/YandexMap";
import {actions} from "../../../../redux/store";

import './TravelAddOnMap.css'

/**
 * @typedef {Object} InputPoint
 * @property {string} id
 * @property {string} text
 * @property {Point} point
 */

export default function TravelAddOnMap() {
    const {user, userLoc} = useSelector(state => state[constants.redux.USER])
    const {travel} = useSelector(state => state[constants.redux.TRAVEL])
    const dispatch = useDispatch()
    const navigate = useNavigate()

    /** референс на контайнер карты */
    const mapRef = useRef(/**@type{HTMLDivElement}*/ null)

    /** интерфейс для взаимодействия с картой */
    const [map, setMap] = useState(/**@type{IMap} */ null)

    /** список точек на карте */
    const [points, setPoints] = useState(/**@type{InputPoint[]} */[])

    // const [userCoords, setUserCoords ] = useState([])

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

    // создаем новое путешествие =======================================================================================
    useEffect(() => {
        if(!travel && user) dispatch(actions.travelActions.travelInit(user))
    }, [travel, user])

    // начальное значение первой точки =================================================================================
    useEffect(() => {
        if (user) setPoints(travel?.waypoints || [{id: createId(user.id), text: '', point: undefined}])
    }, [user])

    // инициализация карты =============================================================================================
    useEffect(() => {
        if (mapRef.current && !map) {
            const waypoints = travel?.waypoints.map(p => p.point)
            YandexMap.init({
                api_key: process.env.REACT_APP_API_KEY,
                mapContainerID: 'map',
                iconClass: 'location-marker',
                points: waypoints || [],
                location: userLoc,
                // suggestElementID: points[0]?.id,
                markerClassName: 'location-marker'
            }).then(newMap => {
                window.map = newMap
                setMap(newMap)
            })
        }

        return () => map && map.destroyMap()
    }, [mapRef.current, map])

    //обработка события drag-point =====================================================================================
    useEffect(() => {
        const handleDragPoint = (e) => {
            const {point: draggedPoint, index} = e.detail
            if (draggedPoint) {
                setPoints(prev => {
                    return prev.map((p, i) =>{
                        if(i === index) return {...p, text: draggedPoint.textAddress, point: draggedPoint}
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
        const coords = await map.getUserLocation()
        console.log('coords', coords)
        map
            .addMarker(coords)
            .then(point => {
                const newPoint = {id: createId(user.id), text: point.textAddress, point}
                const newPoints = [newPoint, ...points]
                dispatch(actions.travelActions.setWaypoints(newPoints.filter(p => !!p.point)))
                setPoints(newPoints)
                setFromUserLocation(true)
            })
    }

    console.log(points)
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
        if(travel){
            const newTravel = {...travel}
            newTravel.direction = newTravel.waypoints
                .map(p => p.text)
                .reduce((acc, address) => {
                    let place = address.split(',').filter(pl => !pl.includes('область')).shift() || ''
                    place = place.trim()
                    return acc ? acc + ' - ' + place : place
                }, '')

            const action = createAction(constants.store.TRAVEL, user.id, 'add', newTravel)
            Promise.all([
                storeDB.addElement(constants.store.TRAVEL, newTravel),
                storeDB.addElement(constants.store.TRAVEL_ACTIONS, action)
            ])
                /** запись новой сущности travel в redux store */
                .then(() => dispatch(actions.travelActions.addTravel(newTravel)))
                .then(() => navigate(`/travel/${newTravel.id}/edite/`))
                .catch(console.error)
        }
    }

    // добавление новой точки ==========================================================================================
    function handleAddNewPoint() {
        dispatch(actions.travelActions.setWaypoints(points.filter(p => !!p.point)))
        navigate('/travel/add/waypoint/')
    }

    function handlePointListChange(newPoints){
        dispatch(actions.travelActions.setWaypoints)
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
