import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import MapPointsInputList from "../../../../components/MapPointsInputList/MapPointsInputList";
import MapControls from "../../../../components/MapControls/MapControls";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import ErrorReport from "../../../../controllers/ErrorReport";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import constants from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import createId from "../../../../utils/createId";
import {actions} from "../../../../redux/store";
import useMap from "../../../../hooks/useMap";
import useTravel from "../../hooks/useTravel";

import './TravelAddOnMap.css'
import YandexMapContainer from "../../../../components/YandexMapContainer/YandexMapContainer";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import useDragPoint from "../../hooks/useDragPoint";

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
    const {travelID, isUserLocation} = useSelector(state => state[constants.redux.TRAVEL])

    /** интерфейс для взаимодействия с картой */
    const [map, setMap] = useState(/** @type {IMap | null} */ null)

    /** список точек на карте */
    const [points, setPoints] = useState(/**@type{InputPoint[]} */[])

    // const [userCoords, setUserCoords ] = useState([])

    /** react ref на последний input элемент, который был в фокусе */
    const lastFocusedElement = useRef(null)


    const draggedPoint = useDragPoint()

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


    //обработка изменения положения точки после взаимодейсвия ==========================================================
    useEffect(() => {
        if(draggedPoint){
            const newPoints = points.map( p => ({...p}))
            newPoints[draggedPoint.index].text = draggedPoint.dragPoint.textAddress
            newPoints[draggedPoint.index].point = draggedPoint.dragPoint
            setPoints(newPoints)
        }
    }, [draggedPoint])

    // обработка фокуса на input =======================================================================================
    async function handleUserLocationPoint() {
        if (!map) return
        /** попытка получить координаты пользователя */
        const coords = await map.getUserLocation().catch((err) => {
            ErrorReport.sendError(err).catch(console.error)
            pushAlertMessage({type: "warning", message: 'Не удалось определить геолокацию'})
            return null
        })

        dispatch(actions.travelActions.setIsUserLocation(true))
        if (coords) {
            /**@type{InputPoint} */
            const newPoint = {id: createId(user.id)}
            /** добавление места с координатами пользователя */
            map
                .addMarker(coords, newPoint.id)
                .then(point => {
                    console.log(point)
                    newPoint.text = point.textAddress
                    newPoint.point = point
                    const newPoints = [newPoint, ...points]
                    /** перезаписываем массив мест (отфильтровываем пустые поля) */
                    dispatch(actions.travelActions.setWaypoints(newPoints.filter(p => !!p.point)))
                    setPoints(newPoints)
                })
                .catch(() => dispatch(actions.travelActions.setIsUserLocation(false)))
        }

    }


    //==================================================================================================================
    /** добавление маршрута с заданными местами для посещения */
    function handleRouteSubmit() {
        if (travel) {
            /** @type{TravelType}*/
            const newTravel = {...travel}
            /** получаем краткое описание направления вида: "новосибирск - бердск" */
            const direction = newTravel.waypoints
                .reduce((acc, p) => {
                    let place = p.point.locality
                        ? p.point.locality
                        : p.text.split(',').filter(pl => !pl.includes('область')).shift() || ''
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

    /**
     * обработка изменения списка точек ( добавлена / удалена / переытавленна)
     * @param {InputPoint[]} newPoints
     */
    function handlePointListChange(newPoints) {
        if (!travel) return
        if (isUserLocation) {
            const arr = [travel.waypoints[0], ...newPoints]
            dispatch(actions.travelActions.setWaypoints(arr))
            setPoints(arr)
        } else {
            /** запись всех измененных полей в текущий travel в store */
            dispatch(actions.travelActions.setWaypoints(newPoints))
            setPoints(newPoints)
        }
    }

    function handleRemoveUserLocationPoint() {
        const newPoints = travel.waypoints.slice(1)
        map.removeMarker(travel.waypoints[0])
        dispatch(actions.travelActions.setWaypoints(newPoints))
        dispatch(actions.travelActions.setIsUserLocation(false))
        setPoints(newPoints)

    }

    if (!travel) return null

    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Направление'}/>
                <div className='column gap-0.5'>
                    {
                        !isUserLocation
                            ? (
                                <div
                                    className='link'
                                    onClick={handleUserLocationPoint}
                                >
                                    + Текущая позиция
                                </div>
                            )
                            : (!!points.length && (
                                    <Swipe
                                        onRemove={handleRemoveUserLocationPoint}
                                        rightButton
                                    >
                                        <Input value={points[0].text} onChange={() => {
                                        }}/>
                                    </Swipe>
                                )

                            )
                    }
                    <MapPointsInputList
                        map={map}
                        pointsList={isUserLocation ? points.slice(1) : points}
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
                <YandexMapContainer travel={travel} userLocation={userLoc} onMapReady={setMap}>
                    <MapControls className='map-controls' map={map}/>
                </YandexMapContainer>
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
