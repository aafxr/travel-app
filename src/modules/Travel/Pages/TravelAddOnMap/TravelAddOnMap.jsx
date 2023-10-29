import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import MapPointsInputList from "../../../../components/MapPointsInputList/MapPointsInputList";
import YandexMapContainer from "../../../../components/YandexMapContainer/YandexMapContainer";
import MapControls from "../../../../components/MapControls/MapControls";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import Container from "../../../../components/Container/Container";
import ErrorReport from "../../../../controllers/ErrorReport";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";
import Swipe from "../../../../components/ui/Swipe/Swipe";
import constants from "../../../../static/constants";
import storeDB from "../../../../db/storeDB/storeDB";
import useDragPoint from "../../hooks/useDragPoint";
import createId from "../../../../utils/createId";
import {actions} from "../../../../redux/store";
import useMap from "../../../../hooks/useMap";
import useTravel from "../../hooks/useTravel";

import './TravelAddOnMap.css'
import InputWithPlaces from "../../../../components/ui/InputWithSuggests/InputWithPlaces";
import useTravelContext from "../../../../hooks/useTravelContext";
import usePoints from "./usePoints";
import useUserSelector from "../../../../hooks/useUserSelector";

// /**
//  * @typedef {Object} InputPoint
//  * @property {string} id
//  * @property {string} text
//  * @property {PointType} point
//  */

/**
 * Страница формирования мест маршрута с картой
 * @function
 * @name TravelAddOnMap
 * @returns {JSX.Element|null}
 * @category Pages
 */
export default function TravelAddOnMap() {
    const {travelCode} = useParams()
    const navigate = useNavigate()
    // const dispatch = useDispatch()
    const {travel, update} = useTravelContext()
    const {user, userLoc} = useUserSelector()
    // const {travelID, isUserLocation} = useSelector(state => state[constants.redux.TRAVEL])

    /** интерфейс для взаимодействия с картой */
    const [map, setMap] = useState(/** @type {IMap | null} */ null)

    // const [userCoords, setUserCoords ] = useState([])


    const {points, setPoints} = usePoints(map)


    const draggedPoint = useDragPoint()


    // если страница обновилась в момент добавления мест на карте, то пользователь перенаправляется заполнять данные заново
    // useEffect(() => {
    //     if (errorMessage) navigate('/travel/add/map/')
    // }, [errorMessage])

    // создаем новое путешествие =======================================================================================
    // useEffect(() => {
    //     if (!travelCode) dispatch(actions.travelActions.travelInit(user))
    // }, [])


    //обработка изменения положения точки после взаимодейсвия ==========================================================
    useEffect(() => {
        if (draggedPoint) {
            const newPoints = points.map(p => ({...p}))
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

        if (coords) {
            /** добавление места с координатами пользователя */
            map
                .addMarker(coords, travel.id)
                .then(point => {
                    console.log(point)
                    if (point) {
                        travel.setFromPoint(point)
                        setPoints(travel.waypoints)
                    }
                })
                .catch(console.error)
        }
    }


    //==================================================================================================================
    /** добавление маршрута с заданными местами для посещения */
    function handleRouteSubmit() {
        /** получаем краткое описание направления вида: "новосибирск - бердск" */
        const direction = travel.waypoints
            .reduce((acc, p) => {
                let place = p.locality?.length > 0
                    ? p.locality
                    : p.address.split(',').filter(pl => !pl.includes('область')).shift() || ''
                place = place.trim()
                return acc ? acc + ' - ' + place : place
            }, '')
        travel.setDirection(direction)
            .save(user.id)
            /** запись новой сущности travel в redux store */
            .then(() => navigate(`/travel/${travel.id}/settings/`))
            .catch(console.error)
    }

    // добавление новой точки ==========================================================================================
    function handleAddNewPoint() {
        const newPoint = map.newPoint(travel.id)
        travel.addWaypoint(newPoint)
        navigate(`/travel/${travel.id}/add/waypoint/${newPoint.id}/`)
    }

    /**
     * обработка изменения списка точек ( добавлена / удалена / переытавленна)
     * @param {PointType[]} newPoints
     */
    function handlePointListChange(newPoints) {
        debugger
        travel.isFromPoint
            ? travel.setWaypoints([travel.fromPoint, ...newPoints])
            : travel.setWaypoints(newPoints)
    }

    function handleRemoveUserLocationPoint() {
        if (travel.isFromPoint) {
            const point = travel.fromPoint
            travel.setFromPoint(null)
            const newPoints = travel.waypoints
            map.removeMarker(point)
            setPoints(newPoints)
        }
    }

    if (!travel) return null

    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Куда вы хотите поехать?'}/>
                <div className='column gap-0.5'>
                    {
                        !travel.isFromPoint
                            ? (
                                <div
                                    className='link'
                                    onClick={handleUserLocationPoint}
                                >
                                    + Указать откуда начнется поездка
                                </div>
                            )
                            : (!!points.length && (
                                    <Swipe
                                        onRemove={handleRemoveUserLocationPoint}
                                        rightButton
                                    >
                                        <Input value={points[0].text} onChange={() => {
                                        }} data-id={points[0].id}/>
                                    </Swipe>
                                )

                            )
                    }
                    <MapPointsInputList
                        map={map}
                        pointsList={travel.isFromPoint ? points.slice(1) : points}
                        onListChange={handlePointListChange}
                    />
                    {
                        !!travel && travel.waypoints.length > 0 && (
                            <div
                                className='link'
                                onClick={handleAddNewPoint}
                            >
                                + Добавить точку маршрута
                            </div>
                        )
                    }
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
