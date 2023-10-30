import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import MapPointsInputList from "../../../../components/MapPointsInputList/MapPointsInputList";
import YandexMapContainer from "../../../../components/YandexMapContainer/YandexMapContainer";
import MapControls from "../../../../components/MapControls/MapControls";
import Container from "../../../../components/Container/Container";
import useTravelContext from "../../../../hooks/useTravelContext";
import useUserSelector from "../../../../hooks/useUserSelector";
import Button from "../../../../components/ui/Button/Button";
import {PageHeader} from "../../../../components/ui";
import useDragPoint from "../../hooks/useDragPoint";
import StartPointInput from "./StartPointInput";
import usePoints from "./usePoints";

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
    const {travel, update} = useTravelContext()
    const {user, userLoc} = useUserSelector()

    /** интерфейс для взаимодействия с картой */
    const [map, setMap] = useState(/** @type {IMap | null} */ null)

    const {points, setPoints} = usePoints(map)

    const draggedPoint = useDragPoint()

    //обработка изменения положения точки после взаимодейсвия ==========================================================
    useEffect(() => {
        if (draggedPoint) {
            const newPoints = points.map(p => ({...p}))
            newPoints[draggedPoint.index].text = draggedPoint.dragPoint.textAddress
            newPoints[draggedPoint.index].point = draggedPoint.dragPoint
            setPoints(newPoints)
        }
    }, [draggedPoint])




    //==================================================================================================================
    /** добавление маршрута с заданными местами для посещения */
    function handleRouteSubmit() {
        travel
            .save(user.id)
            .then(() => navigate(`/travel/${travel.id}/settings/`))
            .catch(console.error)
    }



    /**
     * обработка изменения списка точек ( добавлена / удалена / переытавленна)
     * @param {PointType[]} newPoints
     */
    function handlePointListChange(newPoints) {
        travel.isFromPoint
            ? travel.setWaypoints([travel.fromPoint, ...newPoints])
            : travel.setWaypoints(newPoints)
    }


    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Куда вы хотите поехать?'}/>
                <div className='column gap-0.5'>
                    <StartPointInput map={map}/>
                    <MapPointsInputList
                        map={map}
                        pointsList={travel.isFromPoint ? points.slice(1) : points}
                        onListChange={handlePointListChange}
                    />
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
