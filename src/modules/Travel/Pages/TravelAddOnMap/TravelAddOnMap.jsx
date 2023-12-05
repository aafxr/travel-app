import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import MapPointsInputList from "../../../../components/MapPointsInputList/MapPointsInputList";
import YandexMapContainer from "../../../../components/YandexMapContainer/YandexMapContainer";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import Button from "../../../../components/ui/Button/Button";
import {PageHeader} from "../../../../components/ui";
import useDragPoint from "../../hooks/useDragPoint";
import StartPointInput from "./StartPointInput";

import './TravelAddOnMap.css'


/**
 * Страница формирования мест маршрута с картой
 * @function
 * @name TravelAddOnMap
 * @returns {JSX.Element|null}
 * @category Pages
 */
export default function TravelAddOnMap() {
    const navigate = useNavigate()
    const {travel} = useTravelContext()
    const {user, userLoc} = useUserSelector()
    const [map, setMap] = useState(/**@type{IMap}*/ null)


    // const {points, setPoints} = usePoints(map)

    const draggedPoint = useDragPoint()

    useEffect(() => {
        if (map && travel.waypoints.length) {
            const waypoints = travel.waypoints
            map.clearMap()
            waypoints.forEach(/**@param{PointType} p*/p => map.addPoint({
                id: p.id,
                coords: p.coords
            }, {markerType: "exist"}))
            map.showRoute(waypoints)
            map.autoZoom()
        }
    }, [travel, map])

    //обработка изменения положения точки после взаимодейсвия ==========================================================
    // useEffect(() => {
    //     if (draggedPoint) {
    //         const newPoints = points.map(p => ({...p}))
    //         newPoints[draggedPoint.index].text = draggedPoint.dragPoint.address
    //         newPoints[draggedPoint.index].point = draggedPoint.dragPoint
    //         setPoints(newPoints)
    //     }
    // }, [draggedPoint])


    //==================================================================================================================
    /** добавление маршрута с заданными местами для посещения */
    function handleRouteSubmit() {
        travel
            .save(user.id)
            .then(() => navigate(`/travel/${travel.id}/settings/`))
            .catch(console.error)
    }


    /**
     * обработка изменения списка точек ( добавлена / удалена / переставленна)
     * @param {PointType[]} newPoints
     */
    function handlePointListChange(newPoints) {
        travel.isFromPoint
            ? travel.setWaypoints([travel.fromPoint, ...newPoints])
            : travel.setWaypoints(newPoints)

        map
            .clearMap()
            .showRoute(newPoints, {})
            .showPolyRoute(newPoints.map(p => p.coords),{})
            .autoZoom(newPoints.length > 1 ? undefined : 12)
    }


    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Куда вы хотите поехать?'}/>
                <div className='column gap-0.5'>
                    <StartPointInput map={map}/>
                    <MapPointsInputList
                        map={map}
                        pointsList={travel.isFromPoint ? travel.waypoints.slice(1) : travel.waypoints}
                        onListChange={handlePointListChange}
                    />
                </div>
            </Container>
            <div className='content'>
                <YandexMapContainer onMapReadyCB={setMap}/>
            </div>
            <div className='fixed-bottom-button'>
                <Button
                    onClick={handleRouteSubmit}
                    disabled={!map || map.getMarkers()?.length === 0}
                >
                    Продолжить
                </Button>
            </div>
        </div>
    )
}
