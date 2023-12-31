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
    const {travel, travelObj} = useTravelContext()
    const user = useUserSelector()
    const [map, setMap] = useState(/**@type{IMap}*/ null)


    // const {points, setPoints} = usePoints(map)

    const draggedPoint = useDragPoint()

    useEffect(() => {
        if (map && travelObj && travelObj.waypoints.length) {
            window.map = map
            const waypoints = travelObj.waypoints
            map.clearMap()
            waypoints.forEach(/**@param{PointType} p*/(p, idx) => map.addPoint({
                id: p.id,
                coords: p.coords
            }, {markerType: "exist", iconText: idx + 1}))
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
        travel.change = true
        travel
            .save(user.id)
            .then(() => navigate(`/travel/${travelObj.id}/settings/`))
            .catch(console.error)
    }


    /**
     * обработка изменения списка точек ( добавлена / удалена / переставленна)
     * @param {PointType[]} newPoints
     */
    function handlePointListChange(newPoints) {
        travel.isFromPoint
            ? travel.setWaypoints([travelObj.waypoints[0], ...newPoints])
            : travel.setWaypoints(newPoints)

        map
            .clearMap()
            .showRoute(travelObj.waypoints, {})
            .showPolyRoute(travelObj.waypoints.map(p => p.coords),{})
            .autoZoom(travelObj.waypoints.length > 1 ? undefined : 12)
    }


    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Куда вы хотите поехать?'}/>
                <div className='column gap-0.5'>
                    <StartPointInput map={map}/>
                    <MapPointsInputList
                        map={map}
                        pointsList={travelObj.isFromPoint ? travelObj.waypoints.slice(1) : travelObj.waypoints}
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
                    // disabled={!map ||travel.waypoints.length === 0}
                >
                    Продолжить
                </Button>
            </div>
        </div>
    )
}
